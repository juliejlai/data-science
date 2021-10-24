<template lang="html">

    <body>
        <html>
            <head>
                <meta
                    name="viewport"
                    content="width=device-width, initial-scale=1"
                />
                
            </head>

            <body>
                <br>
                <div class="container-fluid cover" style="width: 100%; backdrop-filter: blur(3px) contrast(0.9)">
                    <div class="pt-5 pb-5 mb-0 text-white">
                        <br>
                        <h1
                            class="mt-5 pt-5 pb-3 mb-0 display-3 center"
                            style="
                                font-size: 80px;
                                color: white;
                            "
                        >
                            Meet Our Team
                        </h1>
                        <h2
                            class="center pb-3"
                            style="
                                font-size: 1.5rem;
                                color: white;
                            "
                        >
                            Thank you for visiting our website! Feel free to
                            reach out to any of our team members through their
                            emails listed below.
                        </h2>
                        <br>
                        <hr color="white" style="height: 5px; backdrop-filter: blur(3px) contrast(0.9)" class="mt-0" />
                        <div class="container center">
                            <img
                                style="
                                    width: auto;
                                    height: 70px;
                                    margin-left: auto;
                                    margin-right: auto;
                                    backdrop-filter: blur(3px) contrast(0.9)
                                "
                            />
                        </div>
                    </div>
                </div>

                

                <div class="container-fluid" style="width: 100%; backdrop-filter: blur(3px) contrast(0.9)">
                    <div
                        class="row center justify-content-center"
                        style="display: flex; width: 100%; backdrop-filter: blur(3px) contrast(0.9)"
                    >
                        <div class="column">
                            <div class="card center">
                                <img
                                    src="https://ca.slack-edge.com/T0WA5NWKG-U012HFBP9PC-213c4b0329f5-512"
                                    alt="Frank Bruni"
                                    style="width: 50%"
                                    class="profile"
                                />
                                <div class="container">
                                    <h2 class="name-card-title pt-3 center">
                                        Frank Bruni
                                    </h2>
                                    <p class="title">Recommender Model & API</p>
                                    <a
                                        class="center"
                                        style="width: fit-content; color: white"
                                        href="mailto:frankbruni@ischool.berkeley.edu"
                                    >
                                        <img
                                            src="./img/mail.svg"
                                            alt="email Frank"
                                        />
                                    </a>
                                </div>
                            </div>
                        </div>

                        <div class="column">
                            <div class="card center">
                                <img
                                    src="https://ca.slack-edge.com/T0WA5NWKG-U012F495TV1-28d089035e9e-512"
                                    alt="Julie Lai"
                                    style="width: 50%"
                                    class="profile"
                                />
                                <div class="container">
                                    <h2 class="name-card-title pt-3 center">
                                        Julie Lai
                                    </h2>
                                    <p class="title">Website Development</p>
                                    <a
                                        href="mailto:julielai@ischool.berkeley.edu"
                                        style="color: white"
                                        ><img
                                            src="./img/mail.svg"
                                            alt="email Julie"
                                    /></a>
                                    <!-- <p>example@example.com</p> -->
                                    <!-- <p><button class="button">Contact</button></p> -->
                                </div>
                            </div>
                        </div>

                        <div class="column">
                            <div class="card center">
                                <img
                                    src="https://ca.slack-edge.com/T0WA5NWKG-U014YSAKM7H-5f1b71348749-512"
                                    alt="Angela Gao"
                                    style="width: 50%"
                                    class="profile"
                                />
                                <div class="container">
                                    <h2 class="name-card-title pt-3 center">
                                        Angela Gao
                                    </h2>
                                    <p class="title">Website Development</p>
                                    <a
                                        href="mailto:agao729@berkeley.edu"
                                        style="color: white"
                                        ><img
                                            src="./img/mail.svg"
                                            alt="email Angela"
                                    /></a>
                                    <!-- <p>example@example.com</p> -->
                                    <!-- <p><button class="button">Contact</button></p> -->
                                </div>
                            </div>
                        </div>
                        <div class="column">
                            <div class="card center">
                                <img
                                    src="https://ca.slack-edge.com/T0WA5NWKG-UU6P51H0D-281b5052f13d-512"
                                    alt="Daphne Yang"
                                    style="width: 50%"
                                    class="profile"
                                />
                                <div class="container">
                                    <h2 class="name-card-title pt-3 center">
                                        Daphne Yang
                                    </h2>
                                    <p class="title">Recommender Model & API</p>
                                    <!-- <p>Some text that describes me lorem ipsum ipsum lorem.</p> -->
                                    <a
                                        href="mailto:daphne.yang@berkeley.edu"
                                        style="color: white"
                                        ><img
                                            src="./img/mail.svg"
                                            alt="email Daphne"
                                    /></a>
                                    <!-- <p><button class="button">Contact</button></p> -->
                                </div>
                            </div>
                        </div>

                    </div>
                </div>
                
            </body>
        </html>

    </body>

</template>


<script>
import WaveSync from '@/wavesync'

export default {
  data () {
    return {
      loading: false
    }
  },

  mounted () {
    this.wavesync = new WaveSync({ fixed: true })
  }
}
</script>


<style lang="scss" scoped>

html {
    box-sizing: border-box;
}

*,
*:before,
*:after {
    box-sizing: inherit;
}

.column {
    float: left;
    width: 33.3%;
    margin-bottom: 16px;
    padding: 0 8px;
}

@media screen and (max-width: 650px) {
    .column {
        width: 100%;
        display: block;
    }
}

.center {
  text-align: center;
}

img {
  display: block;
  margin-left: auto;
  margin-right: auto;
  width: 10%;
}

.card {
    /* box-shadow: 0 4px 8px 0 #b1b2b3; */
    color: white;
    font-size: 1.25rem;
    margin-bottom: 2rem;
}

.container {
    padding: 0 16px;
}

.container::after,
.row::after {
    content: "";
    clear: both;
    display: table;
}

.title {
    color: grey;
}

</style>