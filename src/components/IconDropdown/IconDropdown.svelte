<svelte:options tag="my-dropdown" />

<script>
  import IconDropdownNav from "../../assets/Icon/icon-dropdown-nav.svelte";
  import {clickOutside} from '../../lib/Helpers/clickOutside'

  let isMenuVisible = false;
	let value = ''

	let updateMe = (event)=> {
    console.log(event)
		calc(event.detail);
	}
	

  // setContext('dropdown', {
  //   select: (newValue) => {
  //     console.log('hi')
  //     value = newValue;
  //   }
  // })

  function toggleMenu() {
    isMenuVisible = !isMenuVisible;
  }

  function calc(number) {
    console.log(number + 1)
  }

  function handleClickOutside(event) {
    if(isMenuVisible) {
      isMenuVisible = !isMenuVisible;
    }
	}
 

</script>

<div class="dropdown" on:click={toggleMenu} use:clickOutside on:click_outside={handleClickOutside}>
  <div class="icon"><IconDropdownNav /></div>
    {#if (isMenuVisible)}
      <ul class="options">
        <slot updateMe={updateMe}></slot>
      </ul>
    {/if}
</div>

<style>
  .dropdown {
    position: relative;
  }

  .icon {
    padding: 0.5rem;
  }

  .options {
    position: absolute;
    padding: 0;
    top: 1.5rem;
    left: 0;
    right: 0;
  }
</style>
