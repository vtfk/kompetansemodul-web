<script>
    import Card from "./Card.svelte";
    import { get } from 'svelte/store'
    import { saveCompetence }  from '../lib/services/useApi'
    import { editingPersonalia } from '../lib/services/store'
    import SelectMonth from "./SelectMonth.svelte";
    import SelectYears from "./SelectYears.svelte";
    import fagbrev from '../assets/fagbrevUDIR.json';
    import DataList from './DataList.svelte'
    import fagomraader from '../assets/fagomraader.json'
    import InitialsBadge from "./InitialsBadge.svelte";
    import Button from "./Button.svelte";
    import IconDelete from "./Icons/IconDelete.svelte";
    import IconAdd from "./Icons/IconAdd.svelte";

    // Props
    export let title = 'Utdanning1'
    export let backgroundColor = '--ecruWhite'
    export let competence = {
		education: []
	}
    if (!competence.education) competence.education = []

    // State
    let editInfo = get(editingPersonalia)
    editingPersonalia.subscribe(value => {
        editInfo = value
    })

    let tempEducation = JSON.parse(JSON.stringify(competence.education)) // Create a copy to display correct information (and maybe alert if user has edited) if user aborts edit
    
    let newEducation = {
        fromYear: 2019,
        toYear: 2022,
        fromMonth: 'Januar',
        toMonth: 'Februar'
    }

    // Functions
    const addEducation = () => {
		// need to assign as a new object to make it "reactive"
		tempEducation = [ ...tempEducation, newEducation ]
		newEducation = {
            fromYear: 2019,
            toYear: 2022,
            fromMonth: 'Januar',
            toMonth: 'Februar'
        }
	}

    const removeEducation = edu => {
		tempEducation = tempEducation.filter(education => education !== edu)
	}

    const saveFunc = async () => {
        if(newEducation.subject !== undefined && newEducation.school !== undefined) {
            console.log('Jeg fyra')
        }
        if (checkIfChanges()) {
            await saveCompetence({...competence, education: tempEducation})
            competence.education = tempEducation
        } else {
            console.log('Ingen endring, gidder ikke lagre')
        }
	}

    const checkIfChanges = () => {
        if (JSON.stringify(competence.education) !== JSON.stringify(tempEducation)) return true
        return false
    }

    const cancelFunc = async () => {
        tempEducation = competence.education
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

<Card title={title} editable={true} backgroundColor={backgroundColor} infoBox={ {content: "Her kommer det du trenger hjelp til"}} saveFunc={saveFunc} cancelFunc={cancelFunc}>
    <div>
        {#if editInfo.isEditing && editInfo.editBlock === title}
            {#each tempEducation as tempEdu}
                <div class="eduContainer">
                    <InitialsBadge size='large' initials='🎓' />
                    <div class='eduStuff'>
                        <div class="mainStuff">
                            <div class="editEdu">
                                <div>
                                    <label for="degree">Utdanningsgrad</label><br>
                                    <select name="degree" id="degree" bind:value={tempEdu.degree}>
                                        <option value="Master">Master</option>
                                        <option value="Bachelor">Bachelor</option>
                                        <option value="Årsstudium">Årsstudium</option>
                                        <option value="Fagbrev">Fagbrev</option>
                                        <option value="Videregående skole">Videregående skole</option>
                                        <option value="Doktorgrad">Doktorgrad</option>
                                        <option value="Enkeltemne">Enkeltemne</option>
                                        <option value="Sertifisering">Sertifisering</option>
                                    </select>
                                </div>
                            </div>
                            <div class="editEdu">
                                {#if tempEdu.degree === "Fagbrev"}
                                    <label for="degree">Fagbrev</label><br>
                                    <DataList dataList={utdanningsprogramvariantNavn()} filterFunction={(input, obj) => obj.value.toLowerCase().includes(input.toLowerCase()) || obj.category.toLowerCase().startsWith(input.toLowerCase()) } bind:inputValue={tempEdu.subject}/>
                                {:else}
                                    <label for="subject">Fagområde</label><br>
                                    <DataList dataList={fagomraader} filterFunction={(input, obj) => obj.value.toLowerCase().includes(input.toLowerCase()) || obj.category.toLowerCase().startsWith(input.toLowerCase()) } bind:inputValue={tempEdu.subject}/>
                                {/if}                           
                            </div>
                            <div class="editEdu">
                                <label for="period">Periode</label><br>
                                <label for="from">Fra</label><br>
                                <SelectMonth bind:monthValue={tempEdu.fromMonth}/>
                                <SelectYears startYear={1950} bind:yearValue={tempEdu.fromYear} on:change={() => tempEdu.toYear = tempEdu.fromYear}/>
                                <label for="to">Til</label><br>
                                <SelectMonth bind:monthValue={tempEdu.toMonth}/>
                                    {#if newEducation.fromYear}
                                        <SelectYears startYear={tempEdu.fromYear} bind:yearValue={tempEdu.toYear}/>
                                    {/if}
                            </div>
                            <div class="editEdu">
                                <label for="period">Skole</label><br>
                                <input type="text" bind:value={tempEdu.school}>
                            </div>
                        </div>
                    </div>
                    <div class="deleteButton">
                        <Button buttonText="Fjern" onClick={() => removeEducation(tempEdu)}><IconDelete slot="before" /></Button>
                    </div>
                </div>
            {/each}
            <Button buttonText="Legg til" onClick={() => addEducation()}><IconAdd slot="before" /></Button>
        {:else}
            {#each competence.education as edu}
                <div class="eduContainer">
                    <InitialsBadge size='large' initials='🎓' />
                    <div class='eduStuff'>
                        <div class="mainStuff">
                            <h3>{edu.degree ?? 'Ukjent grad'}</h3>
                            <h4>{edu.subject ?? 'Ukjent fag'}</h4>
                            <p>📅 {(edu.fromMonth && edu.toMonth) ? `${edu.fromMonth} ${edu.fromYear} - ${edu.toMonth} ${edu.toYear}` : 'Ukjent periode'}</p>
                            <p>🏫 {edu.school ?? 'Ukjent skole'}</p>
                        </div>
                    </div>
                </div>
            {/each}
        {/if}
    </div>
</Card>

<style>
    .eduContainer {
        position: relative;
        display: flex;
        padding: 1rem 1rem;
        /*background-color: var(--siv-1);*/
        /*border: 1px solid var(--siv-2);*/
        border: 1px solid var(--mork);
        border-radius: 1rem;
        margin: 1rem 0;
        /*box-shadow: 0 0 0 4px #aedcea;
        box-shadow: 0px 5px 5px 0px rgba(0, 0, 0, 0.3);*/
    }
    .eduStuff {
        margin-left: 32px;
    }
    label {
        font-size: 0.9em;
        font-weight: bold;
        font-style: italic;
    }
    .deleteButton {
        position: absolute;
        right: 1rem;
    }

    input[type=text], select {
        width: 100%;
        padding: 5px 5px;
        display: inline-block;
        border: 1px solid var(--mork);
        border-radius: 0.5rem;
        box-sizing: border-box;
    }

</style>