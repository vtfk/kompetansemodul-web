<svelte:options tag="my-sidenav-item" />

<script>
    import { createEventDispatcher } from 'svelte'
    import { displayedPage } from '../../lib/services/store';

    const dispatch = createEventDispatcher()

    export let value

    function selectedValue(){
        dispatch("clicked", value)
        displayedPage.set(value)
    }
</script>

<div class="sidenav-items">
    <div on:click={selectedValue} >
        <slot></slot>
    </div>
</div>

<style >
    .sidenav-items {
        display: block;
        width: 100%;
        height: 100%;
    }
    .sidenav-items :hover {
        background: #D4E6DC;
        cursor: pointer;
    }
</style>