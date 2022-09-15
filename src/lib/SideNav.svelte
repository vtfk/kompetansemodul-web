<script>
    import Logo from '../assets/Logo.svelte'
    import IoMdHelpCircle from 'svelte-icons/io/IoMdHelpCircle.svelte'
    import { Router, Link, Route } from 'svelte-navigator'; 
    import IconStudents from '../assets/Icon/icon-students.svelte'
    import GiOrganigram from 'svelte-icons/gi/GiOrganigram.svelte'
    import { displayedPage } from './services/store';

    const updateUrl = (appendix) => {
        window.history.replaceState(null, null, appendix)
        // window.history.pushState(new XMLSerializer().serializeToString(document), "Title", appendix);
    }

</script>

<Router>
    <div class="sidenav">
        <div class="logoContainer">
            <Logo />
        </div>
        <div>
            <ul class="sidenav-list">
                <button on:click={() => { displayedPage.set('personalia'); updateUrl('?personalia'); console.log(window.location.pathname) } } class="sidenav-item">
                    <div class="icon">
                        <IconStudents/>
                    </div>
                    <p>Personalia</p>
                </button>
                <button  on:click={() => { displayedPage.set('orgstruktur'); updateUrl('?orgstruktur') } } class="sidenav-item">
                    <div class="icon">
                        <GiOrganigram/>
                    </div>
                    <p>Organiasasjons Struktur</p>
                </button>
                <button on:click={() => { displayedPage.set('hjelp'); updateUrl('?hjeeeelp') } } class="sidenav-item">
                    <div class="icon">
                        <IoMdHelpCircle/>
                    </div>
                    <p>Hjelp</p>
                </button>
            </ul>
        </div>      
    </div>
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

button {
    all:unset
}

button:active {
  outline: #EBF6F9 0.01rem auto;
}

@media screen and (max-height: 450px) {
  .sidenav {padding-top: 15px;}
  .sidenav p {font-size: 18px;}
}
</style>
