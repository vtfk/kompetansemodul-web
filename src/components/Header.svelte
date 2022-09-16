<script>
    import IconDropdown from "./IconDropdown/IconDropdown.svelte";
    import DropdownItem from "./IconDropdown/dropdown-item.svelte";
    import Avatar from "./Avatar.svelte";

    export let title;
    export let name;
    export let avatar;
</script>

<main class="header">
    <div class="title">
        <h3>{title}</h3>
    </div>
    <div class="person-card">
        <div class="collection">
            <div class="name">
                <p>{name}</p>
            </div>
            <div >
                <Avatar avatar={avatar}/>
            </div>
            <div class="icon">
                <IconDropdown let:updateMe>
                    <DropdownItem value="1" on:clicked={updateMe}>Item 1</DropdownItem>
                    <DropdownItem value="2" on:clicked={updateMe}>Item 2</DropdownItem>
                    <DropdownItem value="3" on:clicked={updateMe}>Item 3</DropdownItem>
                </IconDropdown>
            </div>
        </div>
    </div>
</main>

<style>
    .header {
        margin-left: 16px;
        width: 75vw;
        height: 5rem;
        display: flex;
        position: relative;
    }

    .title {
        align-self: center;
        position:absolute;
        width: 10%;
        left: 0;
    }

    .person-card {
       align-self: center;
       position:absolute;
       width: 30%;
       right: 0;
    }

    .collection {
        display:inline-flex;
        align-items: center;
    }

    .name {
        display: flex;
        align-items: center;
        padding: 1rem;
    }

    .icon {
        display: flex;
        align-items: center;
        padding: 1rem;
        cursor: pointer;
    }

    h3 {
        font-family: Nunito, Lato, 'Trebuchet MS', sans-serif;
        font-size: 36px;
        line-height: 28px;
        min-height: 28px;
        font-weight: 400;
    }

    p {
        font-family: Nunito, Lato, 'Trebuchet MS', sans-serif;
    }
</style>
