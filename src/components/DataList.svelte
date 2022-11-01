<script>
    import { clickOutside } from "../lib/Helpers/clickOutside";

    // props
    export let placeholder = 'Skriv inn egen verdi, eller velg fra listen'
    export let displayNumberOfItems = 80
    export let rounded = false
    export let inputValue = ''
    export let maxLength = 2000
    export let dataList = [
        {
            value: "Kjøttkak KjøttkaakKjøttkakKjøttkak Kjøttkak Kjøttkak Kjøttkak KjøttkakKjøttkakKjøttkakKjøttkak  Kjøttkak KjøttkakKjøttkak Kjøttkakv ",
            category: "Food",
            onClick: () => {
                console.log('Æ klikka på Kjøttkak')
            }
        },
        {
            value: "Karbis",
            category: "Food",
            onClick: () => {
                console.log('Æ klikka på Karbis!')
            }
        },
        {
            value: "Øl",
            category: "Drikke",
            onClick: () => {
                console.log('Æ klikka på Øl!')
            }
        },
        {
            value: "Øl",
            category: "Drikke",
        }
    ]
    export let filterFunction = (filterInput, objectToCheck) => {
        return objectToCheck.value.toLowerCase().startsWith(filterInput.toLowerCase())
    }
    
    // state
    let focusing = false
    let showPreview = false
    let previewData = [...dataList]

    // functions
    const clear = () => {
        showPreview = false
        inputValue = ''
        previewData = [...dataList]

    }

    const changeActivePreviewItem = (dir) => {
        if (previewData.length < 2) return
        const currIndex = previewData.findIndex(ele => ele.active)
        if (dir === 'up') {
            if (currIndex > 0) {
                previewData[currIndex].active = false
                previewData[currIndex - 1].active = true
                const containers = document.getElementsByClassName(`previewContainer`)
                if (currIndex !== 0) {
                    for (const container of containers) {
                        const rem = Number(window.getComputedStyle(document.body).getPropertyValue('font-size').replace('px', ''))
                        container.scrollTo({top: (Math.ceil(currIndex/6)*18*rem)-(18*rem), behavior: 'smooth'})
                    }
                }
            }
        } else if (dir === 'down') {
            if (currIndex < previewData.length-1) {
                previewData[currIndex].active = false
                previewData[currIndex + 1].active = true
                const containers = document.getElementsByClassName(`previewContainer`)
                if (currIndex+1 !== 0) {
                    for (const container of containers) {
                        const rem = Number(window.getComputedStyle(document.body).getPropertyValue('font-size').replace('px', ''))
                        container.scrollTo({top: (Math.floor((currIndex+1)/6))*18*rem, behavior: 'smooth'})
                     }
                }
            }
        }
    }

    // Add some necessitiyoies
    const mapDataList = (dataList) => {
        return dataList.map((item, i) => {
            return {
                ...item,
                active: i === 0,
                id: `previewItem-${i}`,
                onClick: () => {
                    inputValue = item.value
                    showPreview = false
                    if (item.onClick) item.onClick()
                }
            }
        })
    }

    // Actual filter function
    const filterPreviewData = () => {
        const dataToPreview = [...dataList]
        if (inputValue && inputValue.length > 0 && !dataList.find(item => item.value.toLowerCase() === inputValue.toLowerCase())) {
            dataToPreview.unshift(
                {
                    value: inputValue,
                    category: "Egendefinert"
                }
            )
        }
        previewData = mapDataList(dataToPreview.filter(ele => filterFunction(inputValue, ele))).slice(0, displayNumberOfItems)
    }

    const onFocus = () => {
        previewData = mapDataList(dataList)
        focusing = true
        showPreview = true
    }
    const onBlur = () => {
        focusing = false
        showPreview = false
    }
    const onKeydown = (e) => {
        if (focusing && showPreview && previewData.length > 0) {
            if (e.key === 'ArrowUp') {
                changeActivePreviewItem('up')
                e.preventDefault()
            } else if (e.key === 'ArrowDown') {
                changeActivePreviewItem('down')
                e.preventDefault()
            } else if (e.key === 'Escape') {
                clear()
                e.preventDefault()
            }  else if (e.key === 'Enter') {
                previewData.find(ele => ele.active).onClick()
                e.preventDefault()
            } else if (e.key === 'Tab') {
                previewData.find(ele => ele.active).onClick()
            }
        }
        if (focusing) {
            if (e.key === 'Escape') {
                clear()
                e.preventDefault()
            } else if (e.key !== 'Enter' && e.key !== 'Tab') {
                showPreview = true
            }
        } else if (e.key !== 'Enter' && e.key !== 'Tab' && e.key !== 'Escape') {
            focusing = true
            showPreview = true
        }
    }

    const focusOnClick = () => {
        if (focusing) {
            showPreview = true
        }
    }

</script>

<div class="searchContainer" use:clickOutside on:click_outside={onBlur}>
    <div class="searchBar{rounded ? ' rounded' : ''}{focusing && showPreview && (previewData.length > 0) ? ' focused' : ''}">
        <input bind:value={inputValue} {placeholder} on:keydown={onKeydown} on:focus={onFocus} on:click={focusOnClick} on:input={filterPreviewData} maxlength={maxLength} />
    </div>
    {#if focusing && showPreview && (previewData.length > 0)}
        <div class="previewContainer">
        {#each previewData.slice(0, displayNumberOfItems) as pv}
            <div id={pv.id} class="previewItem item{ pv.active ? ' active' : ''}" on:click={pv.onClick}>
                <div class="previewItemProp">{pv.value || '???'}</div><div class="previewItemProp"><i>{pv.category || ''}</i></div>
            </div>
        {/each}
        </div>
    {/if}
</div>


<style>
    .searchContainer {
        width: 100%;
        position: relative;
    }
    .searchBar {
        display: flex;
        align-items: center;
        width: 100%;
        background-color: #fff;
        min-width: 100px;
        height: 2rem;
        padding: 0 0.4rem;
        border: 1px solid var(--mork);
        border-radius: 0.5rem;
        box-sizing: border-box;
    }
    .searchBar.rounded {
        border-radius: 24px;
    }
    .searchBar.rounded.focused {
        border-radius: 24px 24px 0px 0px;
    }
    .searchBar.focused {
        border-radius: 0.5rem 0.5rem 0 0;
    }
    input {
        width: 100%;
        height: 100%;
        border: none;
    }
    input:focus {
        outline: 0;
    }
    .previewContainer {
        min-width: 100%;
        position: absolute;
        top: calc(100% - 1px);
        background: #fff;
        z-index: 10;
        border: 1px solid rgb(151, 151, 151);
        border-radius: 0 0 24px 24px;
        padding-bottom: 20px;
        max-height: 18rem;
        box-shadow: 0 0 0 4px #aedcea;
        box-shadow: 0px 13px 10px 0px rgba(0, 0, 0, 0.3);
        overflow-y: auto;
        display: inline-block;
    }
    .previewItem {
        display: flex;
        align-items: center;
        background-color: #fff;
        min-width: 95px;
        min-height: 3rem;
        padding: 0.5rem 1.5rem;
        justify-content: space-between;
    }
    .previewItemProp {
        padding-right: 1rem;
        white-space: nowrap;
    }
    .previewItem.item:hover {
        background-color: #f0f0f0;
        cursor: pointer;
    }
    .previewItem.active {
        background-color: #D6EDF4;
        scroll-margin-top: 10px;
    }

</style>
