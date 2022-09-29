<script>
    export let onClick = () => {console.log('click click')}
    export let disabled = false
    export let size = "medium"
    export let title = "a button"
</script>


<button on:click={onClick} title={title} class={`${size} ${disabled ? 'disabled' : ''}`}>
    <slot></slot>
</button>

<style>
    button {
        all:unset;
        cursor: pointer;
        border-radius: 0px;
        padding: 0.5rem;
        height: 100%;
        min-width: 2rem;
        display: block;
    }
    button:hover {
        background-color: var(--lightBlue);
    }
    button.disabled {
        cursor: not-allowed;
    }
    button.disabled:hover {
        background-color: var(--catSkillWhite);
    }
    button.small {
        height: 1rem;
        min-width: 1rem;
    }
    button.large {
        height: 3rem;
        min-width: 3rem;
    }

</style>