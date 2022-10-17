<script>
    export let buttonText = ''
    export let onClick = () => {console.log('click click')}
    export let disabled = false
    export let size = 'medium'
    export let title = 'a button'

</script>


<button on:click={onClick} title={title} class={`${size} ${disabled ? 'disabled' : ''}`}>
    <div class="beforeContainer"><slot name="before"></slot></div>
    <div class="buttonText">{buttonText}</div>
    <span class="afterContainer"><slot name="after"></slot></span>
</button>

<style>
    .beforeContainer, .buttonText, .afterContainer {
        align-self: center;
        padding: 0 0.1rem;
    }
    .beforeContainer {
        height: 1.2rem;
        width: 1.2rem;
    }
    button {
        all:unset;
        display: flex;
        border: 2px solid black;
        cursor: pointer;
        border-radius: 0.5rem; /* Skal vi ha border radius???? */
        padding-left: 0.5rem;
        padding-right: 0.5rem;
        height: 2rem;
        /* background-color: var(--catSkillWhite); */
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
        height: 1.5rem;
    }
    button.large {
        height: 3rem;
    }

</style>