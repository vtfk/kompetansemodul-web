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
		</div>
		<EmployeeCard employeeData={res} />
		<PositionsCard employeeData={res} />
		<TasksCard />
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
	}
</style>
