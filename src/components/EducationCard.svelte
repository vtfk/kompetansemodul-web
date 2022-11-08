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
    import utdanningsprogramVGS from '../assets/utdanningsprogramVGS.json'
    import Button from "./Button.svelte"
    import IconDelete from "./Icons/IconDelete.svelte"
    import IconAdd from "./Icons/IconAdd.svelte"
    import InnerCard from "./InnerCard.svelte"
    import { educationCardHelp } from '../lib/Helpers/helptexts'
    
    // Props
    export let title = 'Utdanning'
    export let backgroundColor = '--gin'
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
        fromMonth: 'August',
        toMonth: 'Juni',
        credit: 450
    }

    let higherDegrees = ['Master', 'Bachelor', 'Doktorgrad', 'Årsstudium', 'Enkeltemne', 'Fireårig profesjonsstudie', 'Cand.mag.', 'Seksårig profesjonsstudie']
    let degreeInfo = [
        {
            name: 'Doktorgrad',
            score: 450,
            value: 'Doktorgrad'
        },
        {
            name: 'Seksårig profesjonsstudie',
            score: 360,
            value: 'Seksårig profesjonsstudie'
        },
        {
            name: 'Master',
            score: 300,
            value: 'Master'
        },
        {
            name: 'Fireårig profesjonsstudie',
            score: 240,
            value: 'Fireårig profesjonsstudie'
        },
        {
            name: 'Bachelor',
            score: 180,
            value: 'Bachelor'
        },
        {
            name: 'Årsstudium',
            score: 60,
            value: 'Årsstudium'
        },
        {
            name: 'Enkeltemne',
            score: 7.5,
            value: 'Enkeltemne'
        },
        {
            name: 'Cand.mag.',
            score: 210,
            value: 'Cand.mag.'
        },
        {
            name: 'Fagbrev',
            value: 'Fagbrev'
        },
        {
            name: 'Videregående skole',
            value: 'Videregående skole'
        }
    ]

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
                school: true
                // specialization: true,
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
            /*
            if (higherDegrees.includes(edu.degree) && (!edu.specialization || edu.specialization.length < 1)) {
                valid.specialization = false
                canSave = false
            }
            */
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
            fromMonth: 'August',
            toMonth: 'Juni',
            credit: 450
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
        if (degree === 'Fagbrev') return '📜'
        else if (degree === 'Enkeltemne') return '📄'
        else if (degree === 'Videregående skole') return '🏫'
        else if (degree === 'Doktorgrad') return '🤓'
        else return '🎓'
    }

    const chooseSubjectDatalist = (degree) => {
        if (degree === 'Fagbrev') return utdanningsprogramvariantNavn()
        else if (higherDegrees.includes(degree)) return fagomraader
        else if (degree === 'Videregående skole') return utdanningsprogramVGS
        else return []
    }
    const onDegreeChange = (e, tempEdu) => {
        const score = degreeInfo.find(degree => degree.name === e.srcElement.value).score
        if (score) tempEdu.credit = score
        else {
            tempEdu.credit = 0
            tempEdu.specialization = null
        }
        tempEdu.subject = ""
    }
    
</script>

<Card title={title} editable={true} backgroundColor={backgroundColor} infoBox={ {content: educationCardHelp}} canSave={canSave} saveFunc={saveFunc} cancelFunc={cancelFunc}>
    <div>
        {#if editInfo.isEditing && editInfo.editBlock === title}
            {#each tempEducation as tempEdu, i}
                <InnerCard emoji={getEmoji(tempEdu.degree)}>
                    <div slot="first">
                        <label for="degree">Utdanningsgrad</label><br>
                        <select on:change={(e) => {onDegreeChange(e, tempEdu)} } name="degree" id="degree" bind:value={tempEdu.degree}>
                            {#each degreeInfo as degree}
                                <option value={degree.value}>{degree.name}</option>
                            {/each}
                        </select>
                        {#if tempEdu.degree && degreeInfo.find(degree => degree.name === tempEdu.degree).score}
                        <div>
                            <label for="credit">Studiepoeng/Vekttall</label><br>
                            <input type="number" bind:value={tempEdu.credit} />
                        </div>
                        {/if}
                        <div>
                            <label for="subject">{tempEdu.degree === 'Fagbrev' ? tempEdu.degree : tempEdu.degree === 'Videregående skole' ? 'Retning' : 'Fagområde'}</label><label for="subject" class="validation">{!validation[i].subject ? '*' : '' }</label><br>
                            <DataList dataList={chooseSubjectDatalist(tempEdu.degree)} filterFunction={(input, obj) => obj.value.toLowerCase().includes(input.toLowerCase())} bind:inputValue={tempEdu.subject} placeholder={`Skriv inn ${['Fagbrev', 'Sertifisering'].includes(tempEdu.degree) ? tempEdu.degree.toLowerCase() : 'fagområde'} eller velg fra listen`} validation={true} validated={validation[i].subject} />
                        </div>
                        {#if higherDegrees.includes(tempEdu.degree)}
                        <div>
                            <label for="specialization">Fordypning</label><br>
                            <input type="text" bind:value={tempEdu.specialization} />
                        </div>
                        {/if}
                        <div>
                            <div class="checkboxContainer">
                                <input type="checkbox" id="active" bind:checked={tempEdu.isActive} />
                                <label for="active">Pågår</label>
                            </div>
                            <label for="from">Fra</label><br>
                            <div class="peroidContainer">
                                <SelectMonth bind:monthValue={tempEdu.fromMonth}/>
                                <SelectYears startYear={1950} bind:yearValue={tempEdu.fromYear} on:change={() => tempEdu.toYear = tempEdu.fromYear}/>
                            </div>
                            {#if !tempEdu.isActive }
                            <div>
                                <label for="to">Til</label><br>
                                <div class="peroidContainer">
                                    <SelectMonth bind:monthValue={tempEdu.toMonth}/>
                                        {#if newEducation.fromYear}
                                            <SelectYears startYear={tempEdu.fromYear} bind:yearValue={tempEdu.toYear}/>
                                        {/if}
                                </div>
                            </div>
                            {:else}
                                {tempEdu.toMonth = ''}
                                {tempEdu.toYear = ''}
                            {/if}
                        </div>
                        <div>
                            <label for="school">Skole</label><label for="school" class="validation">{!validation[i].school ? '*' : '' }</label><br>
                            <input type="text" class="{!validation[i].school ? 'required' : '' }" bind:value={tempEdu.school}>
                        </div>
                    </div>
                    <div slot="right">
                        <Button buttonText="Fjern" onClick={() => removeEducation(tempEdu)}><IconDelete slot="before" /></Button>
                    </div>
                </InnerCard>
            {/each}
            <Button buttonText="Legg til" onClick={() => addEducation()}><IconAdd slot="before" /></Button>
        {:else if competence.education.length === 0}
            <div><em>Ingen utdanning lagt inn</em></div> 
        {:else}
            {#each competence.education as edu}
                <InnerCard emoji={getEmoji(edu.degree)}>
                    <div slot="first">
                        <h3>{edu.degree ?? 'Ukjent grad'}</h3>
                        <h4>{edu.subject ?? 'Ukjent fagområde'}</h4>
                        {#if edu.specialization}
                            <h4><em>{edu.specialization}</em></h4>
                        {/if}
                        {#if edu.credit}
                            <p>Studiepoeng: {edu.credit}</p>
                        {/if}
                        <p>📅 {(edu.fromMonth && edu.toMonth) ? `${edu.fromMonth} ${edu.fromYear} - ${edu.toMonth} ${edu.toYear}` : `${edu.fromMonth} ${edu.fromYear} - `}</p>
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
    .peroidContainer {
        display: flex;
    }

    input[type=text]:read-only {
        color: grey;
        cursor: not-allowed;
    }

</style>
