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
    import { array_move } from "../lib/Helpers/moveArray"
    
    // Props
    export let title = 'Utdanning'
    export let backgroundColor = '--gin'
    export let competence = {
		education: []
	}
    export let canEdit = true
    export let disableInfoBox = false

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
        credit: 0
    }

    const customDegreeTitle = 'Spesifiser selv'

    let degreeInfo = [
        {
            name: 'Doktorgrad',
            //score: 450,
            isHigher: true,
            value: 'Doktorgrad'
        },
        {
            name: 'Master',
            //score: 300,
            isHigher: true,
            value: 'Master'
        },
        {
            name: 'Bachelor',
            //score: 180,
            isHigher: true,
            value: 'Bachelor'
        },
        {
            name: 'Årsstudium',
            //score: 60,
            isHigher: true,
            value: 'Årsstudium'
        },
        {
            name: 'Enkeltemne',
            score: 7.5,
            isHigher: true,
            value: 'Enkeltemne'
        },
        {
            name: 'Fagbrev',
            value: 'Fagbrev'
        },
        {
            name: 'Videregående skole',
            value: 'Videregående skole'
        },
        {
            name: 'Ingeniør',
            isHigher: true,
            value: 'Ingeniør'
        },
        {
            name: 'Sivilingeniør',
            isHigher: true,
            value: 'Sivilingeniør'
        },
        {
            "value": "cand.med (medisin)",
            "name": "cand.med (medisin)",
            "isHigher": true,
            "hasSubject": true
        },
        {
            "value": "cand.med.vet (veterinærmedisin)",
            "name": "cand.med.vet (veterinærmedisin)",
            "isHigher": true,
            "hasSubject": true
        },
        {
            "value": "cand.theol (teologi)",
            "name": "cand.theol (teologi)",
            "isHigher": true,
            "hasSubject": true
        },
        {
            "value": "cand.mag",
            "name": "cand.mag",
            "isHigher": true,
            "hasSubject": true
        },
        {
            "value": "cand.jur (rettsvitenskap)",
            "name": "cand.jur (rettsvitenskap)",
            "isHigher": true,
            "hasSubject": true
        },
        {
            "value": "cand.hort (hagebruksfag)",
            "name": "cand.hort (hagebruksfag)",
            "isHigher": true,
            "hasSubject": true
        },
        {
            "value": "cand.agric (landbruksvitenskap)",
            "name": "cand.agric (landbruksvitenskap)",
            "isHigher": true,
            "hasSubject": true
        },
        {
            "value": "cand.act (forsikringsfag)",
            "name": "cand.act (forsikringsfag)",
            "isHigher": true,
            "hasSubject": true
        },
        {
            "value": "cand.min (bergvitenskap)",
            "name": "cand.min (bergvitenskap)",
            "isHigher": true,
            "hasSubject": true
        },
        {
            "value": "cand.musicae (musikkvitenskap)",
            "name": "cand.musicae (musikkvitenskap)",
            "isHigher": true,
            "hasSubject": true
        },
        {
            "value": "cand.odont (odontologi)",
            "name": "cand.odont (odontologi)",
            "isHigher": true,
            "hasSubject": true
        },
        {
            "value": "cand.oecon (sosialøkonomi)",
            "name": "cand.oecon (sosialøkonomi)",
            "isHigher": true,
            "hasSubject": true
        },
        {
            "value": "cand.paed (pedagogikk)",
            "name": "cand.paed (pedagogikk)",
            "isHigher": true,
            "hasSubject": true
        },
        {
            "value": "cand.paed.spec (spesialpedagogikk)",
            "name": "cand.paed.spec (spesialpedagogikk)",
            "isHigher": true,
            "hasSubject": true
        },
        {
            "value": "cand.pharm (farmasi)",
            "name": "cand.pharm (farmasi)",
            "isHigher": true,
            "hasSubject": true
        },
        {
            "value": "cand.philol (humanistiske fag)",
            "name": "cand.philol (humanistiske fag)",
            "isHigher": true,
            "hasSubject": true
        },
        {
            "value": "cand.philos (anneneksamen)",
            "name": "cand.philos (anneneksamen)",
            "isHigher": true,
            "hasSubject": true
        },
        {
            "value": "cand.polit (samfunnsvitenskap)",
            "name": "cand.polit (samfunnsvitenskap)",
            "isHigher": true,
            "hasSubject": true
        },
        {
            "value": "cand.real (realfag)",
            "name": "cand.real (realfag)",
            "isHigher": true,
            "hasSubject": true
        },
        {
            "value": "cand.scient (realfag)",
            "name": "cand.scient (realfag)",
            "isHigher": true,
            "hasSubject": true
        },
        {
            "value": "cand.sociol(sosiologi)",
            "name": "cand.sociol(sosiologi)",
            "isHigher": true,
            "hasSubject": true
        },
        {
            "value": customDegreeTitle,
            "name": customDegreeTitle,
            "isHigher": true,
            custom: true
        }
    ]
    let higherDegrees = degreeInfo.filter(degree => degree.isHigher).map(deg => deg.name)
    let hasSubjects = degreeInfo.filter(degree => degree.hasSubject).map(deg => deg.name)

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
                customDegree: true,
                toYear: true, 
                toMonth: true
                // specialization: true,
            }
            // Validation of each field
            if (!edu.subject || edu.subject.length < 1) {
                if (!hasSubjects.includes(edu.degree)) { // If hasSubjects includes the degree, it means that we dont need subject specified in the input field
                    valid.subject = false
                    canSave = false
                }
            }
            if (!edu.school || edu.school.length < 1) {
                valid.school = false
                canSave = false
            }
            if (edu.degree === customDegreeTitle && (!edu.customDegree || edu.customDegree.length < 1)) {
                valid.customDegree = false
                canSave = false
            }

            if (!edu.toYear || edu.toYear.lenght < 1) {
                if (!edu.isActive) {
                    valid.toYear = false
                    canSave = false
                }
            }

            if (!edu.toMonth || edu.toMonth < 1) {
                if (!edu.isActive) {
                    valid.toMonth = false
                    canSave = false
                }
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
            credit: 0
        }
	}

    const removeEducation = edu => {
		tempEducation = tempEducation.filter(education => education !== edu)
	}

    const saveFunc = async () => {
        if (checkIfChanges()) {
            await saveCompetence({...competence, education: tempEducation})
            competence.education = JSON.parse(JSON.stringify(tempEducation))
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
        else if (degree === 'Doktorgrad') return '🎓'
        else if (degree === customDegreeTitle) return '🎓'
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

    const moveEducation = (old_index, new_index) => {
        tempEducation = array_move(tempEducation, old_index, new_index)
    }
    
</script>

<Card title={title} editable={canEdit} disableInfoBox={disableInfoBox} backgroundColor={backgroundColor} infoBox={ {content: educationCardHelp}} canSave={canSave} saveFunc={saveFunc} cancelFunc={cancelFunc}>
    <div>
        {#if editInfo.isEditing && editInfo.editBlock === title}
            {#each tempEducation as tempEdu, i}
                <InnerCard emoji={getEmoji(tempEdu.degree)}>
                    <div slot="first">
                        <label for="degree">Utdanningsgrad</label><br>
                        <select on:change={(e) => {onDegreeChange(e, tempEdu)} } name="degree" id="degree" bind:value={tempEdu.degree}>
                            <optgroup label="Generelle grader">
                                {#each degreeInfo.filter(deg => !deg.hasSubject && !deg.custom) as degree}
                                    <option value={degree.value}>{degree.name}</option>
                                {/each}
                            </optgroup>
                            <optgroup label="Cand. grader">
                                {#each degreeInfo.filter(deg => deg.hasSubject) as degree}
                                    <option value={degree.value}>{degree.name}</option>
                                {/each}
                            </optgroup>
                            <optgroup label="Annet">
                                <option value={customDegreeTitle}>{customDegreeTitle}</option>
                            </optgroup>
                        </select>
                        {#if tempEdu.degree && degreeInfo.find(degree => degree.name === tempEdu.degree).custom}
                        <div>
                            <label for="customDegree">Grad</label><label for="customDegree" class="validation">{!validation[i].customDegree ? '*' : '' }</label><br>
                            <input type="text" class="{!validation[i].customDegree ? 'required' : '' }" bind:value={tempEdu.customDegree}>
                        </div>
                        {/if}
                        {#if tempEdu.degree && (degreeInfo.find(degree => degree.name === tempEdu.degree).score || degreeInfo.find(degree => degree.name === tempEdu.degree).custom)}
                        <div>
                            <label for="credit">Studiepoeng/Vekttall</label><br>
                            <input type="number" bind:value={tempEdu.credit} />
                        </div>
                        {/if}
                        {#if !hasSubjects.includes(tempEdu.degree)}
                            <div>
                                <label for="subject">{tempEdu.degree === 'Fagbrev' ? tempEdu.degree : tempEdu.degree === 'Videregående skole' ? 'Retning' : 'Fagområde'}</label><label for="subject" class="validation">{!validation[i].subject ? '*' : '' }</label><br>
                                <DataList dataList={chooseSubjectDatalist(tempEdu.degree)} filterFunction={(input, obj) => obj.value.toLowerCase().includes(input.toLowerCase())} bind:inputValue={tempEdu.subject} placeholder={`Skriv inn ${['Fagbrev', 'Sertifisering'].includes(tempEdu.degree) ? tempEdu.degree.toLowerCase() : 'fagområde'} eller velg fra listen`} validation={true} validated={validation[i].subject} />
                            </div>
                        {/if}
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
                                <label for="to">Til</label><label for="to" class='validation'>{!validation[i].toMonth || !validation[i].toYear ? '*' : '' }<br>
                                <div class="peroidContainer">
                                <SelectMonth bind:monthValue={tempEdu.toMonth} validation={true} validated={validation[i].toMonth} />
                                    {#if newEducation.fromYear}
                                        <SelectYears startYear={tempEdu.fromYear} bind:yearValue={tempEdu.toYear} validation={true} validated={validation[i].toYear}/>
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
                    <div slot="right" class=slot>
                        <Button buttonText="Fjern" onClick={() => removeEducation(tempEdu)}><IconDelete slot="before" /></Button>
                        <div class="buttonContainer">
                            <div class="upDownButton">
                                <Button onlyIcon={true} title="Flytt Opp" removeSlots={true} buttonText="⬆" disabled={i === 0} onClick={() => moveEducation(i, (i-1))}></Button>
                            </div>
                            <div class="upDownButton">
                                <Button onlyIcon={true} title="Flytt Ned" removeSlots={true} buttonText="⬇" disabled={i === tempEducation.length-1} onClick={() => moveEducation(i, (i+1))}></Button>
                            </div>
                        </div>
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
                        <h3>{edu.customDegree ? edu.customDegree : edu.degree ?? 'Ukjent grad'}</h3>
                        {#if edu.subject && edu.subject.length > 0}
                            <h4>{edu.subject ?? 'Ukjent fagområde'}</h4>
                        {/if}
                        {#if edu.specialization}
                            <h4><em>{edu.specialization}</em></h4>
                        {/if}
                        {#if edu.credit}
                            <p>Studiepoeng: {edu.credit}</p>
                        {/if}
                        <p>📅 {(edu.fromMonth && edu.toMonth) ? `${edu.fromMonth} ${edu.fromYear} - ${edu.toMonth} ${edu.toYear}` : `${edu.fromMonth} ${edu.fromYear} - pågår`}</p>
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
    .buttonContainer {
       display: flex;
    }
    .upDownButton {
        padding-top: 0.5rem;
        padding-left: 0.5rem;
    }
    input[type=text]:read-only {
        color: grey;
        cursor: not-allowed;
    }

    @media(max-width: 885px) {
        .slot {
            display: flex;
        }
        .upDownButton {
            padding-left: 0.5rem;
            padding-top: 0rem;
        }
    }

</style>
