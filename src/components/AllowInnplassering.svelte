<script>
    // Her er js
    import { innplasseringSettings, getPerson } from '../lib/services/useApi'
    import Button from './Button.svelte'
    import IconSpinner from './Icons/IconSpinner.svelte'

    // State
    let canInnplassere = []
    let couldInnplassere = []
    let allEmployees = []
    let limitEmployees = 50
    let showEmployees = []

    let searchValue = ""

    const getInnplasseringer = async () => {
        const payload = {
            innplassering: true,
            method: 'get'
        }
        const innplasseringsData = await innplasseringSettings(payload)
        canInnplassere = innplasseringsData.filter(emp => emp.enabled)
        couldInnplassere = innplasseringsData.filter(emp => !emp.enabled)
        if (allEmployees.length === 0) {
            allEmployees = await getPerson('innplasseringadmin')
            showEmployees = allEmployees.sort((a, b) => (a.navn > b.navn) ? 1 : -1).slice(0, limitEmployees)
        }

        return true
    }

    const handleInnplassering = async (employee, method) => {
        // Legger til og lagrer
        const payload = {
            innplassering: true,
            method,
            ansattnummer: employee.ansattnummer,
            name: employee.name,
            upn: employee.upn
        }
        const confirmation = confirm(`${method === 'add' ? 'Gi' : 'Fjern'} tilgang for ${employee.name}?`)
        if (confirmation) {
            try {
                const res = await innplasseringSettings(payload)
                const refresh = await getInnplasseringer()
            } catch (error) {
                alert(`Dette gikk dårlig... ${error.toString()}`)
            }
        }
    }

    const prettifyDate = (date) => {
        const dateObj = new Date(date)
        return `${dateObj.getDay()}.${dateObj.getMonth()}.${dateObj.getFullYear()}`
    }

    $: {
        showEmployees = showEmployees.sort((a, b) => (a.navn > b.navn) ? 1 : -1)
    }
    $: {
        if (true) {
            showEmployees = allEmployees.filter(emp => (emp.navn.toLowerCase().startsWith(searchValue.toLowerCase())) || (emp.fornavn.toLowerCase().startsWith(searchValue.toLowerCase())) || (emp.etternavn.toLowerCase().startsWith(searchValue.toLowerCase()))).slice(0, limitEmployees)
        }
    }

</script>

<!-- Her kommer HTML kode -->
<h2>Definer hvem som har lov til å innplassere</h2>
{#await getInnplasseringer()}
    <IconSpinner />
{:then res}
    <div class="section added">
        <h3>Disse kan innplassere</h3>
        <div class="tableContainer">
            {#if canInnplassere.length === 0}
                <p><em>Ingen har tilgang til å innplassere enda....</em></p>
            {:else}
                <div class="employeeContainer title">
                    <div class="name"><strong>Navn</strong></div>
                    <div class="upn"><strong>E-post</strong></div>
                    <div class="modifiedBy"><strong>Sist endret av</strong></div>
                    <div class="action"><strong>Handling</strong></div>
                </div>
            {/if}
            {#each canInnplassere as emp}
                <div class="employeeContainer">
                    <div class="name">{emp.name}</div>
                    <div class="upn">{emp.upn}</div>
                    <div class="modifiedBy" title="Sist endret {prettifyDate(emp.timestamp)}">{emp.modifiedBy}</div>
                    <div class="action">
                        <Button buttonText="Fjern tilgang" size="small" removeSlots={true} onClick={async () => {await handleInnplassering(emp, 'remove')}} />
                    </div>
                </div>
            {/each}
        </div>
    </div>
    <div class="section removed">
        <h3>Disse har tidligere hatt lov til å innplassere, men tilgangen er fjernet igjen</h3>
        <div class="tableContainer">
            {#if couldInnplassere.length === 0}
                <p><em>Ingen har fått fjernet tilgang enda...</em></p>
            {:else}
                <div class="employeeContainer title">
                    <div class="name"><strong>Navn</strong></div>
                    <div class="upn"><strong>E-post</strong></div>
                    <div class="modifiedBy"><strong>Sist endret av</strong></div>
                    <div class="action"><strong>Handling</strong></div>
                </div>
            {/if}
            {#each couldInnplassere as emp}
                <div class="employeeContainer">
                    <div class="name">{emp.name}</div>
                    <div class="upn">{emp.upn}</div>
                    <div class="modifiedBy" title="Sist endret {prettifyDate(emp.timestamp)}">{emp.modifiedBy}</div>
                    <div class="action">
                        <Button buttonText="Gi tilgang" size="small" removeSlots={true} onClick={async () => {await handleInnplassering(emp, 'add')}} />
                    </div>
                </div>
            {/each}
        </div>
    </div>
    <div class="section">
        <h3>Legg til andre som kan innplassere</h3>
        <label for="navnesok">Søk etter ansatt-navn</label>
        <input id="navnesok" type="text" bind:value={searchValue} placeholder="Søk etter navn her" />
        <div class="tableContainer">
            {#if showEmployees.length === 0}
                <p><em>Ingen ansatte her gitt...</em></p>
            {:else}
                <div class="employeeContainer title">
                    <div class="name"><strong>Navn</strong></div>
                    <div class="upn"><strong>E-post</strong></div>
                    <div class="action"><strong>Handling</strong></div>
                </div>
            {/if}
            {#each showEmployees as emp}
                <div class="employeeContainer">
                    <div class="name">{emp.navn}</div>
                    <div class="upn">{emp.userPrincipalName}</div>
                    <div class="action">
                        {#if canInnplassere.find(employee => employee.ansattnummer === emp.ansattnummer)}
                            <Button buttonText="Har tilgang" disabled={true} size="small" removeSlots={true} />
                        {:else}
                            <Button buttonText="Gi tilgang" size="small" removeSlots={true} onClick={async () => {await handleInnplassering({ ansattnummer: emp.ansattnummer, upn: emp.userPrincipalName, name: emp.navn }, 'add')}} />
                        {/if}
                    </div>
                </div>
            {/each}
        </div>
        <div class="navigation">
            {#if showEmployees.length === limitEmployees}
                <div style="display: flex; gap: 16px;">
                    <div class="link" on:click={() => { limitEmployees += 50; showEmployees = allEmployees.slice(0, limitEmployees) }}>Vis flere (+50)</div>
                    <div class="link" on:click={() => { if (limitEmployees > 50) {limitEmployees -= 50}; showEmployees = allEmployees.slice(0, limitEmployees) }}>Vis færre (-50)</div>
                </div>
            {/if}
        </div>
    </div>
{:catch error}
    <div>{error}</div>
{/await}


<style>
    /* Her kommer css */
    .section {
        margin: 32px 0;
        border: 1px solid black;
        border-radius: 8px;
        padding: 16px;
    }
    .section.added {
        background-color: var(--grannyApple);
    }
    .section.removed {
        background-color: var(--nype-2);
    }
    .employeeContainer {
        display: flex;
        align-items: center;
        margin: 4px 0px;
    }
    .employeeContainer:hover {
        font-weight: bold;
    }
    .employeeContainer.title:hover {
        font-weight: bold;
    }
    .name {
        width: 250px;
    }
    .upn {
        overflow-wrap: break-word;
        width: 300px;
    }
    .modifiedBy {
        width: 250px;
    }
    .navigation {
        display: flex;
        justify-content: space-around;
        margin-top: 16px;
    }
    .tableContainer {
        margin-top: 16px;
    }
</style>
