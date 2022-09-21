<script>
    import InitialsBadge from "./InitialsBadge.svelte";
    import Menu from "./Menu.svelte";

    export let title;
    export let name;
    export let initials;
</script>

<div class="header">
    <div class="title">
        <h3>{title}</h3>
    </div>
    <div class="headerRight">
        <div class="name">
            <p>{name}</p>
        </div>
        <div class="initials">
            <InitialsBadge initials={initials} />
        </div>
        <div class="menu">
            <Menu />
        </div>
    </div>
</div>

<style>
    .header {
        padding: 16px 0px;
        width: 100%;
        display: flex;
        justify-content: space-between;
        margin-bottom: 64px;
    }

    .headerRight {
        display: flex;
        align-items: center;
    }
    .name {
        margin: 0px 4px;
    }

    .initials {
        margin: 0px 4px;
    }

    .menu {
        margin: 0px 16px
    }

</style>
