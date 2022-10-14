<script>
    import InitialsBadge from "./InitialsBadge.svelte"

    export let emoji = '🤠'
    export let size = 'large'
    export let badgeColor = 'peppermint'
    export let opacity = '0.1'

</script>

<div class="cardContainer" style="background-color: rgba(163, 163, 163, {opacity}">
    <div class="badge">
        <InitialsBadge size={size} initials={emoji} color={badgeColor} />
    </div>
    <div class="cardContent">
        <div class="contentItem first">
            <slot name="first">Her har du ikke lagt inn noe</slot>
        </div>
        <div class="contentItem second">
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
    .first {
        width: 20rem;
    }
    .second {
        width: 15rem;
    }
    .right {
        margin-left: auto;
    }

    @media(max-width: 885px) {
        .cardContainer {
            padding: 0.5rem 0.5rem;
            margin: 0.5rem 0;
            flex-wrap: wrap;
        }
        .contentItem {
            margin: 0 1rem;
        }
        .badge {
            display: none;
        }
        .first {
            width: 100%;
        }
        .cardContent {
            width: 100%;
        }
        .second {
            width: 100%;
        }
        .right {
            margin-top: 0.5rem;
            margin-left: 1rem;
        }
    }
</style>