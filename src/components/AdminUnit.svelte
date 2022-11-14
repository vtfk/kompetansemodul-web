<script>


    export let unit = {
        arbeidsforhold: [
            {
                navn: "Herr Bestefar",
                userPrincipalName: "bestefar@org.com"
            }
        ],
        leder: {},
        navn: "Hei",
        organisasjonsId: "123",
        overordnet: {},
        underordnet: [
            {
                arbeidsforhold: [
                    {
                        navn: "Barnet Gunnar",
                        userPrincipalName: "gunnar@org.com"
                    }
                ],
                leder: {},
                navn: "HeiBarn",
                organisasjonsId: "124",
                overordnet: {},
                underordnet: [
                    {
                        arbeidsforhold: [
                            {
                                navn: "Barnebarnet Berit",
                                userPrincipalName: "berit@org.com"
                            }
                        ],
                        leder: {},
                        navn: "HeiBarneBarn!",
                        organisasjonsId: "125",
                        overordnet: {},
                        underordnet: [],
                    }
                ],
            },
            {
                arbeidsforhold: [],
                leder: {},
                navn: "HeiAndreBarn",
                organisasjonsId: "224",
                overordnet: {},
                underordnet: [],
            }
        ]
    }
	export let level = 0
    export let adminSettings
    export let getChosen
    export let chooseEmployee
    export let chooseUnitAndBelow = 3
    export let addUnit
    export let removeUnit
	
    // State
	let open = level > 4 ? false : true
    let employeesOpen = true

	
	const toggleOpen = () => {
        if (open) employeesOpen = false
        else employeesOpen = true
        open = !open
	}

    const toggleEmployees = () => {
        employeesOpen = !employeesOpen
    }

    const empIsChosen = (chosenEmployees, employee) => {
        if (chosenEmployees.find(emp => emp.userPrincipalName === employee.userPrincipalName)) return true
        else return false
    }

    $: {
        if (chooseUnitAndBelow === 1) {
            addUnit(unit)
        } else if (chooseUnitAndBelow === 2) {
            removeUnit(unit)
        }
    }




</script>

<div class="unit level-{level}" style="margin-left: {level * 40}px;">
    <div class="unitContainer">
        <span class="title {unit.underordnet.length > 0 ? 'hasChildren' : ''}" on:click={toggleOpen}><span class={unit.underordnet.length === 0 ? 'hideMe' : ''}>{open ? '↘ ' : '➡ '}</span>{unit.navn} {adminSettings.oblig.chosenUnits.find(u => u.organisasjonsId === unit.organisasjonsId) ? '✅' : ''}</span>
        <span class="toggle" on:click={toggleEmployees}>
            {getChosen(unit.arbeidsforhold, adminSettings.oblig.chosenEmployees).length > 0 ? '👨🏻‍🤝‍👨🏻' : '👥'}{getChosen(unit.arbeidsforhold, adminSettings.oblig.chosenEmployees).length}/{unit.arbeidsforhold.length}
        </span>
        <span class="link" on:click={toggleEmployees}>
            {employeesOpen ? 'Skjul ansatte' : 'Vis ansatte'}
        </span>
        <div>
            <p class="link" on:click={() => addUnit(unit)}>
                Velg enhet
            </p>
            <p class="link" on:click={() => removeUnit(unit)}>
                Fjern enhet
            </p>
        </div>
        <div>
            <p class="link" on:click={() => { chooseUnitAndBelow = 1; addUnit(unit) }}>
                Velg enhet og underenheter
            </p>
            <p class="link" on:click={() => { chooseUnitAndBelow = 2; removeUnit(unit) }}>
                Fjern enhet og underenheter
            </p>
        </div>
    </div>
    {#if employeesOpen}
        <div class="employees">
            {#each unit.arbeidsforhold as employee}
                <div class="employee" on:click={() => chooseEmployee(employee)}><label for="kudd">{employee.navn}</label> <input id={employee.userPrincipalName} type="checkbox" class="empCheck" checked={empIsChosen(adminSettings.oblig.chosenEmployees, employee)}  /> </div> 
            {/each}
        </div>
    {/if}
</div>

{#if open}
	{#each unit.underordnet as child}
		<svelte:self unit={child} level={level + 1} adminSettings={adminSettings} getChosen={getChosen} chooseEmployee={chooseEmployee} addUnit={addUnit} removeUnit={removeUnit} chooseUnitAndBelow={chooseUnitAndBelow} />
	{/each}
{/if}

<style>
    .unitContainer {
        display: flex;
        align-items: center;
        gap: 16px;
    }
    .hideMe {
        visibility: hidden;
    }
    .toggle {
        cursor: pointer;
    }
    .empCheck {
        font-size: 0.9rem;
    }
    .employees {
        border-left: 1px solid var(--mork);
        padding-left: 24px;
        margin-left: 24px;
        margin-bottom: 16px;
    }
    .unit {
        padding: 8px;
        border-bottom: 1px solid var(--mork);
    }

    .hasChildren:hover {
        text-decoration: underline;
        cursor: pointer;
    }

    .employee {
        font-weight: 400;
        font-size: 0.9rem;
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 8px;
        width: 200px;
    }
    .level-0 .title {
        font-size: 24px;
        line-height: 28px;
        min-height: 28px;
        font-weight: bold;
    }
    .level-1 .title {
        font-size: 21px;
        line-height: 28px;
        min-height: 28px;
        font-weight: 400;
    }
    .level-2 .title {
        font-size: 16px;
        line-height: 25px;
        min-height: 25px;
        font-weight: 700;
    }

</style>