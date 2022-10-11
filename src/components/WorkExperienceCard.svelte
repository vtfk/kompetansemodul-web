<script>
    import { get } from 'svelte/store'
    import { saveCompetence }  from '../lib/services/useApi'
    import { editingPersonalia } from '../lib/services/store'
    import Button from './Button.svelte';
    import TableButton from './TableButton.svelte';
    import IconEdit from './Icons/IconEdit.svelte';
    import IconDelete from './Icons/IconDelete.svelte';
    import IconAdd from './Icons/IconAdd.svelte';
    import IconCheck from './Icons/IconCheck.svelte';
    import IconClose from './Icons/IconClose.svelte';
    import IconSpinner from './Icons/IconSpinner.svelte';
    import IconHelp from './Icons/IconHelp.svelte';
    import InfoBox from './InfoBox.svelte';
    import DataList from './DataList.svelte';
    import { getToday } from '../lib/Helpers/getToday';

    import occupations from '../assets/yrker.json'

    // Props
    export let title = 'Arbeidserfaring'
    export let backgroundColor = '--springWood'
    export let competence = {
		workExperience: []
	}

    if (!competence.workExperience) competence.workExperience = []

    // State
    let isSaving = false
    let saveError = false
    let showInfoBox = false
    let positionValue = ''
    let excludedCategories = []

    // Create a copy to display correct information (and maybe alert if user has edited) if user aborts edit
    let tempWorkExperience = [...competence.workExperience]

    let editInfo = get(editingPersonalia)
    editingPersonalia.subscribe(value => {
        editInfo = value
    })

    const openEdit = () => {
        if (!editInfo.isEditing) {
            editingPersonalia.set({ isEditing: true, editBlock: title })
        } else if (editInfo.isEditing && editInfo.editBlock !== title) {
            alert(`Du redigerer allerede ${editInfo.editBlock}, vennligst fullfør eller avbryt denne redigeringen først`)
        }
    }

    const cancelEdit = () => {
        competence.workExperience = [...tempWorkExperience]
        editingPersonalia.set({ isEditing: false, editBlock: 'ingen' })
    }

    let newWorkExperience = {
        fromMonth: "2021-01",
        toMonth: "2022-01"
    }
    const addWorkExperience = () => {
		// need to assign as a new object to make it "reactive"
        newWorkExperience.position = positionValue
		competence.workExperience = [ ...competence.workExperience, newWorkExperience ]
		newWorkExperience = {
            fromMonth: "2021-01",
            toMonth: "2022-01"
        }
        positionValue = ''
	}
    const removeWorkExperience = exp => {
		competence.workExperience = competence.workExperience.filter(experience => experience !== exp)
	}

    // TODO: remove error msg if user tries again
    const saveCompetencee = async () => {
        // newWorkExperience.employer !== undefined ||  newWorkExperience.position !== undefined || newWorkExperience.field !== undefined || newWorkExperience.mainTasks !== undefined 
        if(newWorkExperience.employer !== undefined &&  newWorkExperience.position !== undefined && newWorkExperience.mainTasks !== undefined ) {
            addWorkExperience()
        }
        isSaving = true
		try {
            if (JSON.stringify(tempWorkExperience) !== JSON.stringify(competence.workExperience)) {
                await saveCompetence(competence)
                console.log('Detta gikk så fint så :)')
                tempWorkExperience = [...competence.workExperience]
            } else {
                console.log('Ingen endring, gidder ikke lagre')
            }
            isSaving = false
            editingPersonalia.set({ isEditing: false, editBlock: 'ingen' })
		} catch (error) {
			console.error('Aiaiaiai:', error)
            isSaving = false
            saveError = error.message
		}
	}

    // const occupationCategories = () => {
    //     const list = uniqBy(occupations.map(occupation => {
    //         return {
    //             category: occupation.category
    //         }
    //     }), item => item.category).map(cat => cat.category)
    //     return list
    // }

    const dataList = (excludedCategories) => {
        let list = occupations.filter(item => !excludedCategories.includes(item.category)).map(occupation => {
            return {
                value: occupation.value,
                category: occupation.category,
                onClick: () => {
                    positionValue = occupation.value
                }
            }
        })
        if (list.length < 1) {
            list = occupations.map(occupation => {
                return {
                    value: occupation.value,
                    category: occupation.category,
                    onClick: () => {
                        positionValue = occupation.value
                    }
                }
            })
        }

        console.log(`Æ har funne ${list.length} yrka`)
        return list.sort((a, b) => a.category.localeCompare(b.category))
    }

    // const categoryFilter = (cat) => {
    //     if (excludedCategories.includes(cat)) {
    //         console.log('Jeg fjernan')
    //         excludedCategories = excludedCategories.filter(category => category !== cat)
    //     }
    //     else {
    //         console.log('jeg la den til')
    //         excludedCategories.push(cat)
    //         excludedCategories = excludedCategories
    //     }
    // }

</script>

<div class="panel" style="background-color: var({backgroundColor});">
    <div class="header">
        <div class="headerTitle"><h3 class="title">{title}</h3><div class="headerIcon" title={showInfoBox ? 'Lukk infoboks' : 'Åpne infoboks'} on:click={() => {showInfoBox = !showInfoBox}}><IconHelp /></div></div>
        {#if editInfo.isEditing && editInfo.editBlock === title}
            {#if isSaving}
                <IconSpinner width="2rem" />
            {:else if saveError}
                {saveError}
                <Button buttonText="Avbryt redigering" onClick={() => cancelEdit()}><IconClose slot="before" /></Button>
            {:else}
                <Button buttonText="Avbryt redigering" onClick={() => cancelEdit()}><IconClose slot="before" /></Button>
            {/if}
        {:else}
            <Button buttonText="Rediger" onClick={() => openEdit()}><IconEdit slot="before" /></Button>
        {/if}
    </div>
    <InfoBox open={showInfoBox} onClose={() => {showInfoBox = !showInfoBox}} />
    <div id="content">
        <table class="cardTable">
            <tr>
                <th>Arbeidsgiver</th>
                <th>Stilling</th>
                <th>Sektor</th>
                <th>Periode</th>
                <th>Oppgaver?</th>
            </tr>
            {#each competence.workExperience as exp}
                <tr>
                    <td>{exp.employer ?? 'Ukjent arbeidsgiver'}</td>
                    <td>{exp.position ?? 'Ukjent stilling'}</td>
                    <td>{exp.field ?? 'Ukjent sektor'}</td>
                    <td>{(exp.fromMonth && exp.toMonth) ? `${exp.fromMonth} - ${exp.toMonth}` : 'Ukjent periode'}</td>
                    <td>{exp.mainTasks ?? 'Ukjente oppgaver'}</td>
                    {#if editInfo.isEditing && editInfo.editBlock === title}
                        <td class="actionCol"><TableButton size="small" onClick={() => removeWorkExperience(exp)} ><IconDelete /></TableButton></td>
                    {/if}
                </tr>
            {/each}
            {#if editInfo.isEditing && editInfo.editBlock === title}
                <tr class="editRow">
                    <td><input type="text" id="employer" size="15" bind:value={newWorkExperience.employer} /></td>
                    <td>
                        <DataList dataList={dataList(excludedCategories)} filterFunction={(input, obj) => obj.value.toLowerCase().includes(input.toLowerCase()) || obj.category.toLowerCase().startsWith(input.toLowerCase())} bind:inputValue={positionValue} />
                    </td>
                    <td>
                        <select name="field" id="field" bind:value={newWorkExperience.field}>
                            <option value="Offentlig">Offentlig</option>
                            <option value="Privat">Privat</option>
                        </select>
                    </td>
                    <td>
                        <input type="month" id="fromMonth" max={getToday().yearMonth} bind:value={newWorkExperience.fromMonth}/>
                        <input type="month" id="toMonth" min={newWorkExperience.fromMonth} max={getToday().yearMonth} bind:value={newWorkExperience.toMonth} />
                    </td>
                    <td><input type="text" id="mainTasks" size="15" bind:value={newWorkExperience.mainTasks} /></td>
                    <td class="actionCol"><TableButton size="small" onClick={() => addWorkExperience()}><IconAdd /></TableButton></td>
                </tr>
                <tr>
                    <!--
                    <td>
                        {#each occupationCategories() as cat, i}
                            <input type="checkbox" id="cat{i}" name="cat{i}" value={cat} on:change={() => categoryFilter(cat)} checked>
                            <label for="cat{i}">{cat}</label><br>
                        {/each}
                    </td>
                    -->
                </tr>
                {#if isSaving}
                    <br />
                    <Button buttonText="Lagrer..." disabled={true}><IconCheck slot="before" /></Button>
                {:else if saveError}
                    {saveError}
                    <br />
                    <Button buttonText="Lagre endringer" onClick={() => saveCompetencee()}><IconCheck slot="before" /></Button>
                {:else}
                    <br />
                    <Button buttonText="Lagre endringer" onClick={() => saveCompetencee()}><IconCheck slot="before" /></Button>
                {/if}
            {/if}
        </table>
    </div>
</div>

<style>
    .header {
        display: flex;
        justify-content: space-between;
        margin: 0 0 16px 0;
    }
    .headerTitle {
        display: flex;
        align-items: center;
    }
    .panel {
        margin-bottom: 32px;
        padding: 40px 32px;
    }
    .cardTable {
        border-collapse: collapse;
    }
    th {
        text-align: left;
        padding-right: 32px;
    }
    td {
        border-bottom: 1px solid black;
        padding: 8px 32px 0px 0px;
    }
    .editRow td {
        border-bottom: none;
    }
    td.actionCol {
        padding: 0px;
    }
    .editRow td.actionCol {
        padding-top: 0.4rem; /* bare for syns skyld... */
    }
    .headerIcon {
        display: flex;
        align-items: center;
        width: 1rem;
        margin-left: 4px;
    }
    .headerIcon:hover {
        cursor: pointer;
        transform: scale(1.2);
    }
    /*
    table tr:nth-child(even) {
        background: #9DCECE;
    }
    */
</style>
