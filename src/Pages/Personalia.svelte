<script>
	import { getMe }  from '../lib/services/useApi'
	import EmployeeCard from '../components/EmployeeCard.svelte'
    import IconSpinner from '../components/Icons/IconSpinner.svelte';
    import EducationCard from '../components/EducationCard.svelte';
    import TasksCard from '../components/TasksCard.svelte';
    import DivCard from '../components/DivCard.svelte';
    import ExperienceCard from '../components/ExperienceCard.svelte';
    import PositionsCard from '../components/PositionsCard.svelte';
    import WorkExperienceCard from '../components/WorkExperienceCard.svelte';
    import IconHelp from '../components/Icons/IconHelp.svelte';
    import InfoBox from '../components/InfoBox.svelte';

	// State
	let showInfoBox = false
	let infoContent = "<h4>Hvorfor samle vi inn din kompetanse på denne måten?</h4><p>Vi ønsker en digital oversikt over kompetansen til ansatte i fylkesadministrasjonen. Intensjonen er å jobbe systematisk med rekruttering og kompetanseutvikling i både VTFK og de nye organisasjonene. Kompetansekartlegging er et verktøy for å anta om to nye fylkeskommuner personalmessig vil være i stand til å løse sitt samfunnsoppdrag</p> <br><p>Husk at du også finner informasjon om kartleggingsverktøyet, GDPR og hva informasjon skal brukes til på Innsida, i personvernerklæringen og i andre informasjonskanaler. Dersom du har spørsmål eller noe er uklart er du alltid velkommen til å kontakte  (sett inn kontaktopplysninger).</p"

	const getMee = async () => {
		const me = await getMe()
		console.log(me)
		return me
	}
</script>

<div class="content">
	{#await getMee()}
		<div class="loadingContainer">
			<span style="display: inline-block;"><IconSpinner width="200px" /></span>
		</div>
	{:then res}
		<div class="pageIntro">
			<h2>Hei, {res.fornavn}! Her kan du se og redigere din kompetanse</h2>
			<div class="headerIcon" title={showInfoBox ? 'Lukk infoboks' : 'Åpne infoboks'} on:click={() => {showInfoBox = !showInfoBox}}><IconHelp /></div>
			<InfoBox content={infoContent} html={true} open={showInfoBox} onClose={() => {showInfoBox = !showInfoBox}} />
		</div>
		<EmployeeCard employeeData={res} />
		<PositionsCard employeeData={res} />
		<TasksCard competence={res.competenceData}/>
		<EducationCard competence={res.competenceData} />
		<WorkExperienceCard competence={res.competenceData} />
		<ExperienceCard competence={res.competenceData}/>
		<DivCard competence={res.competenceData}/>
	{:catch error}
		<p style="color: red">{error.message}</p>
	{/await}
</div>

<style>
	.loadingContainer {
		width: 100%;
		text-align: center;
	}
	.pageIntro {
		margin-bottom: 36px;
		display: flex;
		flex-wrap: wrap;
	}
	.headerIcon {
		flex-shrink: 0;
        display: flex;
        align-items: center;
        width: 1.6rem;
        margin-left: 4px;
    }
	.headerIcon:hover {
        cursor: pointer;
        transform: scale(1.2);
    }
</style>
