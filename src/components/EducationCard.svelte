<script>
    import Card from "./Card.svelte"
    import { get } from 'svelte/store'
    import { saveCompetence }  from '../lib/services/useApi'
    import { editingPersonalia } from '../lib/services/store'
    import SelectMonth from "./SelectMonth.svelte"
    import SelectYears from "./SelectYears.svelte"
    import fagbrev from '../assets/fagbrevUDIR.json'
    import DataList from './DataList.svelte'
    import fagomraader from '../assets/fagomraader.json'
    import Button from "./Button.svelte"
    import IconDelete from "./Icons/IconDelete.svelte"
    import IconAdd from "./Icons/IconAdd.svelte"
    import InnerCard from "./InnerCard.svelte";

    // Props
    export let title = 'Utdanning'
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

    // Validation
    let canSave = false
    let validation = []

    // Reactive validation
    $: {
        canSave = true
        const tempValidation = []
        for (const edu of tempEducation) {
            // What fields are we validating
            const valid = {
                subject: true,
                school: true,
            }
            // Validation of each field
            if (!edu.subject || edu.subject.length < 1) {
                valid.subject = false
                canSave = false
            }
            if (!edu.school || edu.school.length < 1) {
                valid.school = false
                canSave = false
            }

            tempValidation.push(valid)
        }
        validation = JSON.parse(JSON.stringify(tempValidation))
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
        if (checkIfChanges()) {
            await saveCompetence({...competence, education: tempEducation})
            competence.education = JSON.parse(JSON.stringify(tempEducation))
        } else {
            console.log('Ingen endring, gidder ikke lagre')
        }
	}

    const checkIfChanges = () => {
        if (JSON.stringify(competence.education) !== JSON.stringify(tempEducation)) return true
        return false
    }

    const cancelFunc = async () => {
        tempEducation = JSON.parse(JSON.stringify(competence.education))
    }

    const utdanningsprogramvariantNavn = () => {
        return fagbrev.map(variantName => {
            return {
                value: variantName.ProgramomraadeNavn.split(' - ')[1],
                category: variantName.UtdanningsprogramvariantNavn
            }
        }) 
    }

    const getEmoji = (degree) => {
        if (degree === 'Fagbrev') return '🧾'
        else if (degree === 'Sertifisering') return '📜'
        else if (degree === 'Enkeltemne') return '📄'
        else if (degree === 'Videregående skole') return '📝'
        else return '🎓'
    }
    
    const infoText = "<p>Informasjon om hvilken utdanning du har. Vi er interessert i enkeltemner, videreutdanninger, fagbrev eller andre grader av utdanning. Her skal du også legge inn sertifiseringer.<p><br><p>Din utdanning er beskrivende for din formelle kompetanse og er dermed nødvendig i forbindelse med kartleggingen av din kompetanse.</p>"
</script>

<Card title={title} editable={true} backgroundColor={backgroundColor} infoBox={ {content: infoText}} canSave={canSave} saveFunc={saveFunc} cancelFunc={cancelFunc}>
    <div>
        {#if editInfo.isEditing && editInfo.editBlock === title}
            {#each tempEducation as tempEdu, i}
                <InnerCard emoji={getEmoji(tempEdu.degree)}>
                    <div slot="first">
                        <div>
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
                        <div>
                            {#if tempEdu.degree === "Fagbrev"}
                                <label for="subject">Fagbrev</label><label for="subject" class="validation">{!validation[i].subject ? '*' : '' }</label><br>
                                <DataList dataList={utdanningsprogramvariantNavn()} filterFunction={(input, obj) => obj.value.toLowerCase().includes(input.toLowerCase()) || obj.category.toLowerCase().startsWith(input.toLowerCase()) } bind:inputValue={tempEdu.subject}/>
                            {:else}
                                <label for="subject">Fagområde</label><label for="subject" class="validation">{!validation[i].subject ? '*' : '' }</label><br>
                                <DataList dataList={fagomraader} filterFunction={(input, obj) => obj.value.toLowerCase().includes(input.toLowerCase()) || obj.category.toLowerCase().startsWith(input.toLowerCase()) } bind:inputValue={tempEdu.subject}/>
                            {/if}                           
                        </div>
                        <div>
                            <label for="from">Fra</label><br>
                            <div class="peroidContainer">
                                <SelectMonth bind:monthValue={tempEdu.fromMonth}/>
                                <SelectYears startYear={1950} bind:yearValue={tempEdu.fromYear} on:change={() => tempEdu.toYear = tempEdu.fromYear}/>
                            </div>
                            <label for="to">Til</label><br>
                            <div class="peroidContainer">
                                <SelectMonth bind:monthValue={tempEdu.toMonth}/>
                                    {#if newEducation.fromYear}
                                        <SelectYears startYear={tempEdu.fromYear} bind:yearValue={tempEdu.toYear}/>
                                    {/if}
                            </div>
                        </div>
                        <div>
                            <label for="school">Skole</label><label for="school" class="validation">{!validation[i].school ? '*' : '' }</label><br>
                            <input type="text" bind:value={tempEdu.school}>
                        </div>
                    </div>
                    <div slot="right">
                        <Button buttonText="Fjern" onClick={() => removeEducation(tempEdu)}><IconDelete slot="before" /></Button>
                    </div>
                </InnerCard>
            {/each}
            <Button buttonText="Legg til" onClick={() => addEducation()}><IconAdd slot="before" /></Button>
        {:else if competence.education.length === 0}
            <div><p>Ingen utdanning lagt inn</p></div> 
        {:else}
            {#each competence.education as edu}
                <InnerCard emoji={getEmoji(edu.degree)}>
                    <div slot="first">
                        <h3>{edu.degree ?? 'Ukjent grad'}</h3>
                        <h4>{edu.subject ?? 'Ukjent fag'}</h4>
                        <p>📅 {(edu.fromMonth && edu.toMonth) ? `${edu.fromMonth} ${edu.fromYear} - ${edu.toMonth} ${edu.toYear}` : 'Ukjent periode'}</p>
                        <p>🏫 {edu.school ?? 'Ukjent skole'}</p>
                    </div>
                </InnerCard>
            {/each}
        {/if}
    </div>
</Card>

<style>
    label {
        font-size: 0.9em;
        font-weight: bold;
        font-style: italic;
    }
    input[type=text], select {
        width: 100%;
        padding: 5px 5px;
        display: inline-block;
        border: 1px solid var(--mork);
        border-radius: 0.5rem;
        box-sizing: border-box;
    }
    .peroidContainer {
        display: flex;
    }
    
    .validation {
        color: var(--red)
    }

</style>