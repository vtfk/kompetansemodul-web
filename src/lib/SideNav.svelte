<script>
    import Logo from '../assets/Logo.svelte'
    import IoMdHelpCircle from 'svelte-icons/io/IoMdHelpCircle.svelte'
    import { Router, Link, Route } from 'svelte-navigator'; 
    import IconStudents from '../assets/Icon/icon-students.svelte'
    import GiOrganigram from 'svelte-icons/gi/GiOrganigram.svelte'

    //Pages
    import Hjelp from './Pages/Hjelp.svelte';
    import Orgstruktur from './Pages/Orgstruktur.svelte';
    import Personalia from './Pages/Personalia.svelte';

    export let show_content = 'personalia'
</script>

<Router>
    <body class="main">
        <div class="sidenav">
            <div class="logoContainer">
                <Logo />
            </div>
            <div>
                <ul class="sidenav-list">
                    <button on:click={() => show_content = 'personalia'} class="sidenav-item">
                        <div class="icon">
                            <IconStudents/>
                        </div>
                        <p>Personalia</p>
                    </button>
                    <button  on:click={() => show_content = 'orgstruktur'} class="sidenav-item">
                        <div class="icon">
                            <GiOrganigram/>
                        </div>
                        <p>Organiasasjons Struktur</p>
                    </button>
                    <button on:click={() => show_content = 'hjelp'} class="sidenav-item">
                        <div class="icon">
                            <IoMdHelpCircle/>
                        </div>
                        <p>Hjelp</p>
                    </button>
                </ul>
            </div>      
        </div>
        <div class="content">
            { #if show_content === 'personalia'}
                <Personalia />
            { :else if show_content === 'orgstruktur' }
                <Orgstruktur />
            { :else if show_content === 'hjelp' }
                <Hjelp />
            {/if }
        </div>      
    </body>
</Router>

<style>
body {
    font-family: 'Nunito Sans', Lato, 'Trebuchet MS', sans-serif;
}

.sidenav {
    height: 100%;
    width: 10rem;
    position: fixed;
    z-index: 1;
    top: 0;
    left: 0;
    background-color: #EAF3EF;
    overflow-x: hidden;
    padding-top: 1.5rem;
}

.sidenav p {
    font-family: 'Nunito Sans', Lato, 'Trebuchet MS', sans-serif;
    padding: 0.25rem 0.25rem 0.25rem 0.5rem;
    text-decoration: none;
    font-size: 16px;
    color: #000000;
    display: block;
}

.sidenav-item {
    display: block;
    padding-top: 1rem;
    width: 100%;
    height: 100%;
}

.sidenav-list {
    list-style: none;
    margin: 0;
    padding: 0;
    padding-top: 8rem;
    text-align: center;
    width: 100%;
}

.sidenav-list :hover {
    background: #D4E6DC;
    cursor: pointer;
}

.main {
    margin-left: 11rem; 
}

.icon {
    color: #000000;
    width: 2rem;
    height: 2rem;
    margin-bottom: -1rem;
    margin-left: auto;
    margin-right: auto;
    display: block;
  }

.logoContainer {
    width: 3rem;
    margin: auto;
    margin-top: 2rem;
}

.content {
    background-color: #F8F6F0;
    width: 100vw;
    height: 100vh;
}

button {
    all:unset
}

.icon-active {
    background-color: red;
}

button:active {
  outline: #EBF6F9 0.01rem auto;
}

@media screen and (max-height: 450px) {
  .sidenav {padding-top: 15px;}
  .sidenav p {font-size: 18px;}
}
</style>