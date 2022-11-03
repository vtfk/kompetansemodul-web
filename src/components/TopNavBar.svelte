<script>
    import sticky from '../lib/Helpers/sticky';

    let stickToTop = true;
    let isStuck = false
    
    function handleStuck(e) {
        isStuck = e.detail.isStuck;
    }

</script>

<div class="navbar" id="navbar" class:isStuck data-position={stickToTop ? 'top' : 'bottom'} use:sticky={{ stickToTop }} on:stuck={handleStuck}>
    <a class="content" href="#Ansattinformasjon">Ansattinformasjon</a>
    <a class="content" href="#Dagens stillinger og oppgaver">Dagens stillinger og oppgaver</a>
    <a class="content" href="#Ønsket fylkeskommune / arbeidssted etter oppdeling">Ønsket fylkeskommune / arbeidssted etter oppdeling</a>
    <a class="content" href="#Kritiske oppgaver">Kritiske oppgaver</a>
    <a class="content" href="#Tidligere arbeidserfaring">Tidligere arbeidserfaring</a>
    <a class="content" href="#Utdanning">Utdanning</a>
    <a class="content" href="#Kurs og Sertifiseringer">Kurs og Sertifiseringer</a>
    <a class="content" href="#Verv">Verv</a>
</div>

<style>
    .navbar {
        background-color: aqua;
        display: flex;
        position: sticky;
        margin-bottom: 1.5rem;
        border: 1px solid black; 
        z-index: 1000;
        transition: all 0.3s;
    }
    .content {
        background-color: beige;
        flex-wrap: wrap;
        padding: 0.5rem;
    }

    .navbar[data-position='top'] {
        top: 1rem;
    }

    .navbar[data-position='bottom'] {
        bottom: 1rem;
    }

    .navbar.isStuck {
        background: mintcream;
        box-shadow: 0px 0px 1px 0px rgba(0, 0, 0, 0.2),
            0px 0px 6px 0px rgba(0, 0, 0, 0.3);
    }
</style>