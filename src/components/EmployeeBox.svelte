<script>
    import InitialsBadge from "./InitialsBadge.svelte"
    import { getPhoto } from '../lib/services/useApi'
    import { repackPosTitle } from '../lib/Helpers/repackPosTitle'
    
    // Props
    export let employeeData = {}
    export let backgroundColor = "--whiteTone"
    export let onClick = undefined
    export let expandedView = false

    
    if (!employeeData.navn) employeeData.navn = "Jeg er en bug som ikke skal være her..."
    employeeData.fornavn = employeeData.navn.split(' ').slice(0, employeeData.navn.split(' ').length-1).join(' ')
    employeeData.etternavn = employeeData.navn.split(' ')[employeeData.navn.split(' ').length-1]
    let employeeInfo = {
        initials: `${employeeData.fornavn.slice(0,1)} ${employeeData.etternavn.slice(0,1)}`,
        name: employeeData.navn,
        mainTitle: repackPosTitle(employeeData.stillingstittel, employeeData.arbeidsforholdstype),
        mainDepartment: employeeData.department,
        officeLocation: employeeData.officeLocation ?? 'Ukjent kontorplass',
        email: employeeData.userPrincipalName ?? 'Ukjent e-post',
        tasks: employeeData.tasks ?? [],
        isPrivileged: employeeData.isPrivileged ?? false,
        mandatoryCompetenceInput: employeeData.mandatoryCompetenceInput ?? null,
        soloRole: employeeData.soloRole,
        perfCounty: employeeData.perfCounty,
        leaderWithoutRelation: employeeData.leaderWithoutRelation ?? false
    }

    const checkIfFinished = (tasks, soloRole, perfCounty) => {
        return (tasks.length > 0 && soloRole && perfCounty)
    }

    // Handle photo
    const handlePhoto = async () => {
        const url = window.URL || window.webkitURL;
        const photoData = await getPhoto(employeeInfo.email)
        const blobUrl = url.createObjectURL(photoData);
        return blobUrl
    }

</script>

<div class="box" style="background-color: var({backgroundColor};">
    {#if !expandedView}
        <div class="smallMainBox" on:click={onClick}>
            <div class="employeeInfo small">
                <div class="badge">
                    {#await handlePhoto()}
                        <InitialsBadge size='medium' initials={employeeInfo.initials} />
                    {:then res}
                        <InitialsBadge size='medium' image={res}  />
                    {:catch error}
                        <InitialsBadge size='medium' initials={employeeInfo.initials} />
                    {/await}
                </div>
                <div class="smallEmployeeInfo">
                    <h4>{employeeInfo.name}</h4>
                    <p class="posTitle">{employeeInfo.mainTitle}</p>
                    {#if employeeInfo.isPrivileged}
                        {#if employeeInfo.mandatoryCompetenceInput}
                            {#if checkIfFinished(employeeInfo.tasks, employeeInfo.soloRole, employeeInfo.perfCounty)}
                                <div class="finished task">Har fylt ut obligatorisk info 👍</div>
                            {:else}
                                <div class="notFinished task">Har <strong>ikke</strong> fylt ut obligatorisk info 😢</div>
                            {/if}
                        {:else if !employeeInfo.leaderWithoutRelation}
                            <div class="voluntary task">Ikke obligatorisk å legge inn info</div>
                        {/if}
                    {/if}
                </div>
            </div>
        </div>
    {:else}
        <div class="mainBox" on:click={onClick}>
            <div class="employeeInfo">
                <div class="badge">
                    {#await handlePhoto()}
                        <InitialsBadge size='large' initials={employeeInfo.initials} />
                    {:then res}
                        <InitialsBadge size='large' image={res}  />
                    {:catch error}
                        <InitialsBadge size='large' initials={employeeInfo.initials} />
                    {/await}
                </div>
                <h4>{employeeInfo.name}</h4>
                <p class="posTitle">{employeeInfo.mainTitle}</p>
                <p class="info">{employeeInfo.officeLocation}</p>
            </div>
            <div class="employeeTasks">
            {#if employeeInfo.isPrivileged}
                {#if employeeInfo.mandatoryCompetenceInput}
                    {#if checkIfFinished(employeeInfo.tasks, employeeInfo.soloRole, employeeInfo.perfCounty)}
                        <div class="finished task">Har fylt ut obligatorisk info 👍</div>
                    {:else}
                        <div class="notFinished task">Har <strong>ikke</strong> fylt ut obligatorisk info 😢</div>
                    {/if}
                {:else}
                    <div class="voluntary task">Ikke obligatorisk å legge inn info</div>
                {/if}
            {/if}
            {#if employeeInfo.tasks.length > 0}
                {#each employeeInfo.tasks as task, i}
                    {#if i === 4}
                        <div class="task">...<!--{ (employeeInfo.tasks.length-4) }--></div>
                    {:else if i < 4}
                        <div class="task">{task}</div>
                    {/if}
                {/each}
                {:else}
                    <p class="task"><em>Har ikke lagt inn oppgaver</em></p>
            {/if}
            </div>
        </div>
        <div class="footer">
            <p class="info">💬 <a target="_blank" href="https://teams.microsoft.com/l/chat/0/0?users={employeeInfo.email}">Send melding på Teams</a></p>
            <p class="info">✉ <a href ="mailto:{employeeInfo.email}">Send e-post</a></p>
        </div>
    {/if}
</div>

<style>
    .box {
        width: 350px;
        margin-bottom: 1rem;
        border: 1px solid var(--greyTone);
        box-shadow: rgb(0 0 0 / 13%) 0px 1.6px 3.6px 0px, rgb(0 0 0 / 11%) 0px 0.3px 0.9px 0px;
        border-radius: 2px;
        position: relative;
    }
    .mainBox {
        padding: 2rem 2rem 90px 2rem;
        cursor: pointer;
        height: 100%;
    }
    .smallMainBox {
        padding: 1rem;
        cursor: pointer;
    }
    .smallMainBox:hover {
        padding: 1rem;
        background-color: var(--lightGrey) !important;
    }
    .mainBox:hover {
        background-color: var(--lightGrey) !important;
        /*background-color: var(--springWood) !important;*/
    }
    .badge {
        display: flex;
        justify-content: center;
    }
    .employeeTasks {
        text-align: center;
        padding-top: 1rem;
        /*display: flex;
        flex-wrap: wrap;
        justify-content: space-between;*/
    }
    .employeeInfo {
        text-align: center;
        border-bottom: 1px solid var(--greyTone);
        padding-bottom: 0.5rem;
    }
    .employeeInfo.small {
        border-bottom: none;
        display: flex;
        align-items: center;
        text-align: left;
    }
    .smallEmployeeInfo {
        padding-left: 16px;
    }
    .footer {
        border-top: 1px solid var(--greyTone);
        padding: 8px 32px;
        text-align: center;
        position: absolute;
        bottom: 0px;
        width: 100%;
    }
    .posTitle {
        color: var(--mork);
    }
    .info {
        font-size: 0.9rem;
    }
    .task {
        font-size: 0.8rem;
    }
    .finished {
        color: green;
    }
    .notFinished {
        color: var(--red);
    }
    .voluntary {
        color: var(--mork)
    }
</style>
