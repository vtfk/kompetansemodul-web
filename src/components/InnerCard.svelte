<script>
    import InitialsBadge from "./InitialsBadge.svelte"

    export let emoji = '🤠'
    export let size = 'large'
    export let badgeColor = 'peppermint'
    export let opacity = '0.1'
    export let firstWidth = "20rem"
    export let secondWidth = "15rem"

</script>

<div class="cardContainer" style="background-color: rgba(163, 163, 163, {opacity}">
    <div class="badge">
        <InitialsBadge size={size} initials={emoji} color={badgeColor} />
    </div>
    <div class="cardContent">
        <div class="contentItem" style="width: {firstWidth}">
            <slot name="first">Her har du ikke lagt inn noe</slot>
        </div>
        <div class="contentItem" style="width: {secondWidth}">
            <slot name="second"></slot>
        </div>
    </div>
    <div class="right">
        <slot name="right"></slot>
    </div>
</div>


<style>
    .cardContainer {
        position: relative;
        display: flex;
        padding: 1rem 1rem;
        border-radius: 1rem;
        margin: 1rem 0;
    }
    .cardContent {
        display: flex;
        flex-wrap: wrap;
    }
    .contentItem {
        margin: 0 2rem;
    }
    .right {
        margin-left: auto;
    }
</style>