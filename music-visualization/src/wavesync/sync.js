import Observe from '../util/observe'
import * as cookies from '../util/cookie'
import { get } from '../util/network'
import interpolate from '../util/interpolate'
import { scaleLog } from 'd3-scale'
import { min } from 'd3-array'
import ease from '../util/easing'

/**
 * @class Sync
 * 
 * Creates an interface for analyzing a playing Spotify track in real time.
 * Exposes event hooks for reacting to changes in intervals. 
 */
export default class Sync {
  constructor ({
    volumeSmoothing = 100,
    pingDelay = 2500
  } = {}, fixed = false) {
    const accessToken = cookies.get('SPOTIFY_ACCESS_TOKEN')
    const refreshToken = cookies.get('SPOTIFY_REFRESH_TOKEN')
    const refreshCode = cookies.get('SPOTIFY_REFRESH_CODE')

    this.state = Observe({
      api: {
        currentlyPlaying: 'https://api.spotify.com/v1/me/player',
        trackAnalysis: 'https://api.spotify.com/v1/audio-analysis/',
        trackFeatures: 'https://api.spotify.com/v1/audio-features/',
        tokens: {
          accessToken,
          refreshToken,
          refreshCode
        },
        headers: {
          'Authorization': 'Bearer ' + accessToken,
          'Accept': 'application/json'
        },
        pingDelay
      },
      intervalTypes: ['tatums', 'segments', 'beats', 'bars', 'sections'],
      activeIntervals: Observe({
        tatums: {},
        segments: {},
        beats: {},
        bars: {},
        sections: {}
      }),
      currentlyPlaying: {},
      trackAnalysis: {},
      trackFeatures: {
        energy: .2
      },
      initialTrackProgress: 0,
      initialStart: 0,
      trackProgress: 0,
      active: false,
      noPlayback: null,
      initialized: false,
      volumeSmoothing,
      volume: 0,
      queues: {
        volume: [],
        beat: []
      }
    })

    this.initHooks()

    if (fixed === true) {
      setTimeout(() => {
        this.state.trackAnalysis = this.buildStaticIntervals()
        this.state.active = true
        requestAnimationFrame(this.tick.bind(this))
      }, 300)
    } else {
      this.ping()
    }
  }

  /**
   * @method initHooks - Initialize interval event hooks. 
   */
  initHooks () {
    this.hooks = {
      tatum: () => {},
      segment: () => {},
      beat: () => {},
      bar: () => {},
      section: () => {}
    }

    this.state.activeIntervals.watch('tatums', t => this.hooks.tatum(t))
    this.state.activeIntervals.watch('segments', s => this.hooks.segment(s))
    this.state.activeIntervals.watch('beats', b => this.hooks.beat(b))
    this.state.activeIntervals.watch('bars', b => this.hooks.bar(b))
    this.state.activeIntervals.watch('sections', s => this.hooks.section(s))
  }

  /**
   * @method ping - Ask Spotify for currently playing track, after a specified delay. 
   */
  ping () {
    setTimeout(() => this.getCurrentlyPlaying(), this.state.api.pingDelay)
  }

  /**
   * @method getNewToken - Retrieve new access token from server. 
   */
  async getNewToken () {
    if (!this.state.api.tokens.refreshToken) {
      window.location.href = '/'
    }
    
    const { data } = await get(`${process.env.PROJECT_ROOT}/refresh?token=${this.state.api.tokens.refreshToken}`)
    cookies.set('SPOTIFY_ACCESS_TOKEN', data.access_token)
    this.state.api.tokens.accessToken = data.access_token
    this.state.api.headers = {
      'Authorization': 'Bearer ' + this.state.api.tokens.accessToken,
      'Accept': 'application/json'
    }
    this.ping()
  }

  /**
   * @method getCurrentlyPlaying - Ask Spotify for currently playing track.
   */
  async getCurrentlyPlaying () {
    try {
      const { data } = await get(this.state.api.currentlyPlaying, { headers: this.state.api.headers })
      if (!data || !data.is_playing) {
        if (this.state.active === true) {
          this.state.active = false
        }

        if (this.state.noPlayback !== true) {
          this.state.noPlayback = true
        }
        return this.ping()
      }

      this.processResponse(data)
    } catch ({ status }) {
      if (status === 401) {
        return this.getNewToken()
      }
    }
  }

  /**
   * @method processResponse - Process `currently playing` API response according to state.
   * @param {object} data - Response from Spotify API. 
   */
  processResponse (data) {
    const songsInSync = (JSON.stringify(data.item) === JSON.stringify(this.state.currentlyPlaying))

    if (this.state.initialized === false || !songsInSync || this.state.active === false) {
      return this.getTrackInfo(data)
    }

    this.ping()
  }
  
  /**
   * @method getTrackInfo - Fetch track analysis and track features of currently playing track.
   * @param {object} data - Response from Spotify API. 
   */
  async getTrackInfo (data) {
    const tick = window.performance.now()
    const [ analysis, features ] = await Promise.all([
      get(this.state.api.trackAnalysis + data.item.id, { headers: this.state.api.headers }).then(res => res.data),
      get(this.state.api.trackFeatures + data.item.id, { headers: this.state.api.headers }).then(res => res.data),
    ])

    this.state.intervalTypes.forEach((t) => {
      const type = analysis[t]
      type[0].duration = type[0].start + type[0].duration
      type[0].start = 0
      type[type.length - 1].duration = (data.item.duration_ms / 1000) - type[type.length - 1].start
      type.forEach((interval) => {
        if (interval.loudness_max_time) {
          interval.loudness_max_time = interval.loudness_max_time * 1000
        }
        interval.start = interval.start * 1000
        interval.duration = interval.duration * 1000
      })
    })

    const tock = window.performance.now() - tick

    this.state.currentlyPlaying = data.item
    this.state.trackAnalysis = analysis
    this.state.trackFeatures = features
    this.state.initialTrackProgress = data.progress_ms + tock
    this.state.trackProgress = data.progress_ms + tock
    this.state.initialStart = window.performance.now()

    if (this.state.initialized === false) {
      requestAnimationFrame(this.tick.bind(this))
      this.state.initialized = true
    }

    if (this.state.active === false) {
      this.state.active = true
    }
     
    if (this.state.noPlayback === true) {
      this.state.noPlayback = false
    }

    this.ping()
  }

  /**
   * @method setActiveIntervals - Use current track progress to determine active intervals of each type.
   */
  setActiveIntervals () {
    const determineInterval = (type) => {
      const analysis = this.state.trackAnalysis[type]
      const progress = this.state.trackProgress
      for (let i = 0; i < analysis.length; i++) {
        if (i === (analysis.length - 1)) return i
        if (analysis[i].start < progress && progress < analysis[i + 1].start) return i
      }
    }
  
    this.state.intervalTypes.forEach(type => {
      const index = determineInterval(type)
      if (!this.state.activeIntervals[type].start || index !== this.state.activeIntervals[type].index) {
        this.state.activeIntervals[type] = { ...this.state.trackAnalysis[type][index], index }
      }

      const { start, duration } = this.state.activeIntervals[type]
      const elapsed = this.state.trackProgress - start
      this.state.activeIntervals[type].elapsed = elapsed
      this.state.activeIntervals[type].progress = ease(elapsed / duration)
    })
  }

  /**
   * @method getVolume - Extract volume data from active segment. 
   */
  getVolume () {
    const {
      loudness_max,
      loudness_start,
      loudness_max_time,
      duration,
      elapsed,
      start,
      index
    } = this.state.activeIntervals.segments

    if (!this.state.trackAnalysis.segments[index + 1]) return 0
    
    const next = this.state.trackAnalysis.segments[index + 1].loudness_start
    const current = start + elapsed
  
    if (elapsed < loudness_max_time) {
      const progress = Math.min(1, elapsed / loudness_max_time)
      return interpolate(loudness_start, loudness_max)(progress)
    } else {
      const _start = start + loudness_max_time
      const _elapsed = current - _start
      const _duration = duration - loudness_max_time
      const progress = Math.min(1, _elapsed / _duration)
      return interpolate(loudness_max, next)(progress)
    }
  }

  /**
   * @method watch - Convenience method for watching data store.
   * @param {string} key 
   * @param {function} method 
   */
  watch (key, method) {
    this.state.watch(key, method)
  }

  /**
   * @method on - Convenience method for applying interval hooks.
   * @param {string} - Interval type. 
   * @param {function} - Event handler. 
   */
  on (interval, method) {
    this.hooks[interval] = method
  }

  /**
   * @getter isActive - Returns if class is actively syncing with a playing track. 
   */
  get isActive () {
    return this.state.active === true
  }

  /**
   * @method getInterval - Convenience method for retreiving active interval of type.
   * @param {string} type - Interval type, e.g. `beat` or `tatum`
   */
  getInterval (type) {
    return this.state.activeIntervals[type + 's']
  }

  /**
   * @method tick - A single update tick from the Sync loop. 
   * @param {DOMHighResTimeStamp} now 
   */
  tick (now) {
    requestAnimationFrame(this.tick.bind(this))
    if (!this.state.active) return

    /** Set track progress and active intervals. */
    this.state.trackProgress = (now - this.state.initialStart) + this.state.initialTrackProgress
    this.setActiveIntervals()

    /** Get current volume. */
    const volume = this.getVolume()
    const queues = this.state.queues

    /** Add volume value to the beginning of the volume queue. */
    queues.volume.unshift(volume)

    /** If the queue is larger than 400 values, remove the last value. */
    if (queues.volume.length > 400) {
      queues.volume.pop()
    }

    /** Add volume value to the beginning of the beat queue. */
    queues.beat.unshift(volume)

    /** If the queue is larger than our defined smoothing value, remove the last value. */
    if (queues.beat.length > this.state.volumeSmoothing) {
      queues.beat.pop()
    }

    function average (arr) {
      return arr.reduce((a, b) => (a + b)) / arr.length
    }

    /** Scale volume (dB) to a linear range using the minimum and average values of the volume queue. */
    const sizeScale = scaleLog()
      .domain([min(queues.volume), average(queues.volume)])
      .range([0, 1])

    /** Average the beat queue, then pass it to our size scale. */
    const beat = average(queues.beat)
    this.volume = sizeScale(beat)
  }

  buildStaticIntervals () {
    const analysis = {}
    const base = 3000
    const duration = {
      beats: base,
      tatums: [base * .666, base * .333],
      segments: base / 2,
      sections: base * 16,
      bars: base * 4
    }

    const types = ['tatums', 'segments', 'beats', 'bars', 'sections']
  
    types.forEach(type => {
      analysis[type] = []
  
      for (var i = 0; i < 10000; i++) {
        const tatumStart = analysis.tatums[i - 1]
          ? analysis.tatums[i - 1].start + analysis.tatums[i - 1].duration
          : 0
  
        const tatumDuration = (i % 2 === 0)
          ? duration.tatums[0]
          : duration.tatums[1]
  
        analysis[type].push({
          start: (type === 'tatums')
            ? tatumStart
            : i * duration[type],
          duration: (type === 'tatums')
            ? tatumDuration
            : duration[type],
          loudness_start: i * i,
          loudness_max: i * i,
          loudness_max_time: base / 2 / 1000
        })
      }
    })

    return analysis
  }
}