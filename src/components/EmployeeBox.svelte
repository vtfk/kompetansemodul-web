<script>
    import InitialsBadge from "./InitialsBadge.svelte"
    import { getPhoto } from '../lib/services/useApi'
    
    // Props
    export let employeeData = {}
    export let backgroundColor = "--whiteTone"

    
    // If org view or person view
    employeeData.fornavn = employeeData.navn.split(' ').slice(0, employeeData.navn.split(' ').length-1).join(' ')
    employeeData.etternavn = employeeData.navn.split(' ')[employeeData.navn.split(' ').length-1]
    let employeeInfo = {
        initials: `${employeeData.fornavn.slice(0,1)} ${employeeData.etternavn.slice(0,1)}`,
        name: `${employeeData.fornavn} ${employeeData.etternavn}`,
        mainTitle: employeeData.stillingstittel ?? 'Ukjent tittel',
        mainDepartment: employeeData.department,
        officeLocation: employeeData.officeLocation ?? 'Ukjent kontorplass',
        email: employeeData.userPrincipalName ?? 'Ukjent e-post',
    }

    // Handle photo
    const handlePhoto = async () => {
        const url = window.URL || window.webkitURL;
        const photoData = await getPhoto(employeeInfo.email)
        const blobUrl = url.createObjectURL(photoData);
        return blobUrl
    }

</script>
<!--
<div class="box" style="background-color: var({backgroundColor};">
    <div class ="badgeContainer">
        <div class="badge">
            {#await handlePhoto()}
                <InitialsBadge size='large' initials={employeeInfo.initials} />
            {:then res}
                <InitialsBadge size='large' image={res}  />
            {:catch error}
                <InitialsBadge size='large' initials={employeeInfo.initials} />
            {/await}
        </div>
        <div class="employee">
            <h4>{employeeInfo.name}</h4>
            <p class="posTitle">{employeeInfo.mainTitle}</p>
        </div>
    </div>
    <div class="employeeInfo">
        <p class="info">{employeeInfo.officeLocation}</p>
        <p class="info">✉ {employeeInfo.email}</p>
    </div>
    <div class="employeeTasks">
        <p class="info"> • Oppgave1</p>
        <p class="info"> • Oppgave2</p>
        <p class="info"> • Oppgave3</p>
    </div>
</div>
-->

<div class="box" style="background-color: var({backgroundColor};">
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
        <p class="info">✉ {employeeInfo.email}</p>
    </div>
    <div class="employeeTasks">
        <p class="info"> • Driver med ditten</p>
        <p class="info"> • Datten</p>
        <p class="info"> • Og andre greier</p>
    </div>
</div>
<style>
    .box {
        padding: 2rem 2rem;
        width: 350px;
        margin-bottom: 1rem;
        border: 1px solid var(--greyTone);
        box-shadow: rgb(0 0 0 / 13%) 0px 1.6px 3.6px 0px, rgb(0 0 0 / 11%) 0px 0.3px 0.9px 0px;
        border-radius: 2px;
    }
    .badgeContainer {
        width: 100%;
        display: flex;
        padding-bottom: 1rem;
        align-items: center;
    }
    .badge {
        display: flex;
        justify-content: center;
    }
    .employee {
        padding-left: 1rem;
    }
    .employeeTasks {
        padding-top: 1rem;
        display: flex;
        flex-wrap: wrap;
        justify-content: space-between;
    }
    .employeeInfo {
        text-align: center;
        padding-bottom: 1rem;
        border-bottom: 1px solid var(--greyTone);
    }
    .posTitle {
        color: var(--mork);
    }
    .info {
        font-size: 0.9rem;
    }
</style>
