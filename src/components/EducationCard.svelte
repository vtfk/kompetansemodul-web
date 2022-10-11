<script>
    import { get } from 'svelte/store'
    import { saveCompetence }  from '../lib/services/useApi'
    import { editingPersonalia } from '../lib/services/store'
    import { getToday } from '../lib/Helpers/getToday';
    import Button from './Button.svelte';
    import TableButton from './TableButton.svelte';
    import IconEdit from './Icons/IconEdit.svelte'
    import IconDelete from './Icons/IconDelete.svelte';
    import IconAdd from './Icons/IconAdd.svelte';
    import IconCheck from './Icons/IconCheck.svelte';
    import IconClose from './Icons/IconClose.svelte';
    import IconSpinner from './Icons/IconSpinner.svelte';
    import IconHelp from './Icons/IconHelp.svelte';
    import InfoBox from './InfoBox.svelte';
    import fagbrev from '../assets/fagbrevUDIR.json';
    import DataList from './DataList.svelte'

    // Props
    export let title = 'Utdanning'
    export let backgroundColor = '--ecruWhite'
    export let competence = {
		education: []
	}

    if (!competence.education) competence.education = []

    // State
    let isSaving = false
    let saveError = false
    let showInfoBox = false

    // Create a copy to display correct information (and maybe alert if user has edited) if user aborts edit
    let tempEducation = [...competence.education]

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
        competence.education = [...tempEducation]
        editingPersonalia.set({ isEditing: false, editBlock: 'ingen' })
    }

    let newEducation = {
        fromMonth: "2021-01",
        toMonth: "2022-01"
    }
    const addEducation = () => {
		// need to assign as a new object to make it "reactive"
		competence.education = [ ...competence.education, newEducation ]
		newEducation = {
            fromMonth: "2021-01",
            toMonth: "2022-01"
        }
	}
    const removeEducation = edu => {
		competence.education = competence.education.filter(education => education !== edu)
	}

    // TODO: remove error msg if user tries again
    const saveCompetencee = async () => {
        if(newEducation.subject !== undefined && newEducation.school !== undefined) {
            addEducation()
        }
        isSaving = true
		try {
            if (JSON.stringify(tempEducation) !== JSON.stringify(competence.education)) {
                await saveCompetence(competence)
                console.log('Detta gikk så fint så :)')
                tempEducation = [...competence.education]
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

    const utdanningsprogramvariantNavn = () => {
        return fagbrev.map(variantName => {
            return {
                value: variantName.ProgramomraadeNavn.split(' - ')[1],
                category: variantName.UtdanningsprogramvariantNavn
            }
        }) 
    }                   

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
                <th>Utdanningsgrad</th>
                {#if newEducation.degree === "Fagbrev"}
                    <th>Fagbrev</th>
                {:else}
                    <th>Fagområde</th>
                {/if}
                <th>Periode</th>
                <th>Skole</th>
            </tr>
            {#each competence.education as edu}
                <tr>
                    <td>{edu.degree ?? 'Ukjent grad'}</td>
                    <td>{edu.subject ?? 'Ukjent fag'}</td>
                    <!-- <td>{edu.fagbrev ?? 'Ukjent fagbrev'}</td> -->
                    <td>{(edu.fromMonth && edu.toMonth) ? `${edu.fromMonth} - ${edu.toMonth}` : 'Ukjent periode'}</td>
                    <td>{edu.school ?? 'Ukjent skole'}</td>
                    {#if editInfo.isEditing && editInfo.editBlock === title}
                        <td class="actionCol"><TableButton size="small" onClick={() => removeEducation(edu)} ><IconDelete /></TableButton></td>
                    {/if}
                </tr>
            {/each}
            {#if editInfo.isEditing && editInfo.editBlock === title}
                <tr class="editRow">
                    <td>
                        <select name="degree" id="degree" bind:value={newEducation.degree}>
                            <option value="Master">Master</option>
                            <option value="Bachelor">Bachelor</option>
                            <option value="Årsstudium">Årsstudium</option>
                            <option value="Fagbrev">Fagbrev</option>
                            <option value="Doktorgrad">Doktorgrad</option>
                        </select>
                    </td>
                    {#if newEducation.degree === "Fagbrev"}
                        <td>
                            <DataList dataList={utdanningsprogramvariantNavn()} filterFunction={(input, obj) => obj.value.toLowerCase().includes(input.toLowerCase()) || obj.category.toLowerCase().startsWith(input.toLowerCase()) } bind:inputValue={newEducation.subject}/>
                            <!-- <input list="fagområder" name="fagområde" id="fagområde" bind:value={newEducation.fagområde}/>
                            <datalist id="fagområder">
                                {#each utdanningsprogramvariantNavn().map(variantName => variantName) as variationName}
                                    <option>{variationName}</option>
                                {/each}
                            </datalist> -->
                        </td>
                        <!-- <td>
                            <input list="fagbrevlist" name="fagbrev" id="fagbrev"/>
                            <datalist id="fagbrevlist">
                                {#each getFagbrev(newEducation.fagområde).map(fagbrev => fagbrev) as fagbrevName}
                                    <option>{fagbrevName}</option>
                                {/each}
                            </datalist>
                        </td> -->
                    {:else}
                        <td><input list="fagområder" name="fagområde" id="fagområde" bind:value={newEducation.subject}/></td>
                    {/if}
                    <td>
                        <input type="month" id="fromMonth" max={getToday().yearMonth} bind:value={newEducation.fromMonth}/>
                        <input type="month" id="toMonth" min={newEducation.fromMonth} max={getToday().yearMonth} bind:value={newEducation.toMonth} />
                    </td>
                    <td><input type="text" id="school" size="20" bind:value={newEducation.school} /></td>
                    <td class="actionCol"><TableButton size="small" onClick={() => addEducation()}><IconAdd /></TableButton></td>
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
