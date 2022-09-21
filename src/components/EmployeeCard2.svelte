<script>
    import InitialsBadge from "./InitialsBadge.svelte";

    export let title = 'Ansattinformasjon'
    export let backgroundColor = '--springWood'
    export let employeeData = {
        name: 'Test',
        email: 'test@test.no',
        mainPosition: 'rotgiver',
        officeLocation: 'Narnia',
        employeeType: 'Løst ansatt',
        manager: 'Sjefen',
        employedSince: '2021'
    }
</script>

<div class="panel" style="background-color: var({backgroundColor});">
    <!--<div class="header"><h3 class="title">{title}</h3></div>-->
    <div class="content">
        <InitialsBadge size='large' initials='? ?' />
        <div class='employeeStuff'>
            <h3>{employeeData.name}</h3>
            <h4>{employeeData.mainPosition}</h4>
            <p><strong>Navn:</strong> {employeeData.name}</p>
            <p><strong>Stilling:</strong> {employeeData.mainPosition}</p>
            <p><strong>E-post:</strong> {employeeData.email}</p>
            <p><strong>Lokasjon:</strong> {employeeData.officeLocation}</p>
            <p><strong>Stillingstype:</strong> {employeeData.employeeType}</p>
            <p><strong>Nærmeste leder:</strong> {employeeData.manager}</p>
            <p><strong>Ansatt siden:</strong> {employeeData.employedSince}</p>
        </div>
    </div>
</div>

<style>
    .content {
        display: flex;
    }
    .employeeStuff {
        margin-left: 32px;
    }
    .panel {
        margin-bottom: 32px;
        padding: 40px 32px;
    }
    .title {
        margin: 0 0 16px 0;
    }
</style>
