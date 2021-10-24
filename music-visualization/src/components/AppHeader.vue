<template>
  <header>
    <nav>
      <ul>
        <li><router-link to="/visualizer">Visualizer</router-link></li>
        <li><router-link to="/about">About</router-link></li>
        <li><router-link to="/recommender">Get Recommendations</router-link></li>
      </ul>
    </nav>
  </header>

</template>

<style lang="scss">
    header {
    display: flex;
    padding: .5rem 1rem;

    p {
      margin-left: 1rem;
    }
    a {   
        color: white;   
    }

    a:active {
        color: #E4FDE1;
    }

    a[tabindex]:focus {
        color:#E4FDE1;
        outline: none;
    }

  }

  nav {
    margin-left: auto;

    ul {
        @include scale(font-size 26px 18px, line-height 26px 18px, margin-top 0px 0px);
      list-style: none;
    }

    ul li {
      display: inline-flex;
      margin-left: 1rem;
    }
  }
</style>