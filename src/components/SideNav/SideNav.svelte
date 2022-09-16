<svelte:options tag="my-sidenav" />

<script>
        import Logo from '../../assets/Logo.svelte'


    let navItem =''

    let selectedItem = (event) => {
        
    }
</script>

<div class="sidenav">
    <div class="logoContainer">
        <Logo />    
    </div>
    <div class="sidenav-list" on:click={selectedItem}>
        <slot></slot>
    </div>
</div>

<style>
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

    .logoContainer {
        width: 3rem;
        margin: auto;
        margin-top: 2rem;
    }

    .sidenav-list {
        list-style: none;
        margin: 0;
        padding: 0;
        padding-top: 8rem;
        width: 100%;
    }

    @media screen and (max-width: 1024px) {
        .sidenav {
            width: 8rem;
        }
    }
</style>