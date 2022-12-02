<script>
    import { changePage } from '../lib/Helpers/changePage'
    import { get } from 'svelte/store'
	import { orgOpenStore }  from '../lib/services/store'
    import InitialsBadge from './InitialsBadge.svelte';

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
	
    // State
	//let open = level > 0 ? false : true
    let open = get(orgOpenStore)[unit.organisasjonsId]

	
	const toggleOpen = () => {
        open = !open
        const oos = get(orgOpenStore)
        oos[unit.organisasjonsId] = open
        orgOpenStore.set(oos)
	}

    const getLeader = (unit) => {
        if (unit.arbeidsforhold.find(f => f.ansattnummer === unit.leder.ansattnummer)) return unit.arbeidsforhold.find(f => f.ansattnummer === unit.leder.ansattnummer)
        else return {
            navn: unit.leder.navn,
            ansattnummer: unit.leder.ansattnummer,
            stillingstittel: 'Leder'
        }
    }

</script>

<div class="unit level-{level+1}" style="margin-left: {1 * 24}px;">
<!--<div class="unit level-{level+1}">-->
    <div class="unitContainer">
        <div class="title"><span title="Utvid enhet" class="expandable" on:click={toggleOpen}>{open ? '↘ ' : '➡ '}</span><span title="Gå til enhet" class="unitLink" on:click={() => changePage('minenhet', { setUnit: unit.organisasjonsId })}>{unit.navn}</span></div>
    </div>
    {#if open}
        <div class="employees">
            {#if unit.leder && unit.leder.ansattnummer}
                <div class="employee leader"><InitialsBadge color="siv-3" initials={`${getLeader(unit).navn.substring(0,1)}${getLeader(unit).navn.substring(getLeader(unit).navn.lastIndexOf(' ')+1).substring(0,1)}`} size="xSmall" /><span on:click={() => changePage('person', { setPerson: unit.leder.ansattnummer } ) }> {getLeader(unit).navn} - {getLeader(unit).stillingstittel}</span></div> 
            {/if}
            {#each unit.arbeidsforhold.filter(emp => unit.leder && emp.ansattnummer !== unit.leder.ansattnummer) as employee}
                <div class="employee"><InitialsBadge initials={`${employee.navn.substring(0,1)}${employee.navn.substring(employee.navn.lastIndexOf(' ')+1).substring(0,1)}`} size="xSmall" /> {employee.navn} - {employee.stillingstittel}</div> 
            {/each}
        </div>
        {#each unit.underordnet as child}
            <svelte:self unit={child} level={level + 1} />
        {/each}
    {/if}
</div>

<style>
    .unitContainer {
        display: flex;
        align-items: center;
        gap: 16px;
        padding-top: 8px;
    }
    .expandable:hover {
        text-decoration: underline;
        cursor: pointer;
    }
    .employees {
        margin-left: 24px;
    }
    .unit {
        padding: 0px;
        border-bottom: 0px solid var(--mork);
        text-align: center;
    }
    .unitLink:hover {
        text-decoration: underline;
        cursor: pointer;
    }
    .employee {
        font-weight: 400;
        font-size: 0.9rem;
        display: flex;
        align-items: center;
        gap: 8px;
    }
    .employeeContainer {
        display: flex;
        justify-content: center;
    }
    .leader {
        font-weight: bold;
    }
    .title {
        display: flex;
        gap: 8px;
    }
    .level-0 .title {
        font-size: 48px;
        line-height: 66px;
        min-height: 66px;
        font-weight: 700;
    }
    .level-1 .title {
        font-size: 36px;
        line-height: 40px;
        min-height: 40px;
        font-weight: 400;
    }
    .level-2 .title {
        font-size: 24px;
        line-height: 28px;
        min-height: 28px;
        font-weight: bold;
    }
    .level-3 .title {
        font-size: 21px;
        line-height: 28px;
        min-height: 28px;
        font-weight: 400;
    }
    .level-4 .title {
        font-size: 18px;
        line-height: 25px;
        min-height: 25px;
        font-weight: 500;
    }
    .level-5 .title {
        font-size: 16px;
        line-height: 25px;
        min-height: 25px;
        font-weight: bold;
    }

</style>