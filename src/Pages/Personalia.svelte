<script>
	import { getMe }  from '../lib/services/useApi'
	import EmployeeCard from '../components/EmployeeCard.svelte'
	import PosistionsCard from '../components/PositionsCard.svelte'
	import EducationCard from '../components/EducationCard.svelte'
	import WorkExperienceCard from '../components/WorkExperienceCard.svelte'
    import IconSpinner from '../components/Icons/IconSpinner.svelte';


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
			<h2>Hei, {res.fornavn}! Dette er informasjon om deg.</h2>
			<p><em>Her kan du gjøre ditten og datten</em></p>
		</div>
		<EmployeeCard employeeData={res} />
		<PosistionsCard positions={res.tidligereArbeidsforhold} />
		<EducationCard competence={res.competenceData} />
		<WorkExperienceCard competence={res.competenceData} />
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
	}
</style>
