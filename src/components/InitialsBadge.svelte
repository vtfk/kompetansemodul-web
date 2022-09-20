<script>
    export let initials;
</script>

<main>
    <p class="initialsBadge">{initials}</p>
</main>

<style>
    .initialsBadge {
        width: calc(var(--baseUnit) * 3);
        height: calc(var(--baseUnit) * 3);
        line-height: calc(var(--baseUnit) * 3);
        text-align: center;
        border-radius: 50%;
        font-size: calc(var(--baseUnit) * 1.5);
        color: #1D1C28;
        background: #D4E6DC;
    }
</style>