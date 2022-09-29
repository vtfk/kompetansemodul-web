<script>
	import { getMe, saveCompetence }  from '../lib/services/useApi'
	import EmployeeCard from '../components/EmployeeCard.svelte'
	import PosistionsCard from '../components/PositionsCard.svelte'
	import EducationCard from '../components/EducationCard.svelte'
	import WorkExperienceCard from '../components/WorkExperienceCard.svelte'
    import IconSpinner from '../components/Icons/iconSpinner.svelte';

	let competence = {
		preOfficeLocation: '',
		prefferedCounty: '',
		education: [],
		workExperience: []
	}

	let newEducation = {}

	const addEducation = () => {
		// need to assign as a new object to make it "reactive"
		competence.education = [ ...competence.education, newEducation ]

		newEducation = {}
	}
	
	const removeEducation = brukernavn => {
		competence.education = competence.education.filter(education => education.brukernavn !== brukernavn)
	}

	const getMee = async () => {
		const me = await getMe()
		competence.fodselsnummer = me.fodselsnummer
		if (me.competenceData) {
			if (me.competenceData.education) {
				competence.education = me.competenceData.education
			}

			if (Array.isArray(me.tidligereArbeidsforhold) && me.tidligereArbeidsforhold.length > 0) {
				competence.workExperience = me.tidligereArbeidsforhold
			}

			competence.preOfficeLocation = me.competenceData.preOfficeLocation
			competence.prefferedCounty = me.competenceData.prefferedCounty
		}

		console.log(me)
		return me
	}

	const saveCompetencee = async () => {
		try {
			await saveCompetence(competence)
			console.log('Detta gikk så fint så :)')
		} catch (error) {
			console.error('Aiaiaiai:', error)
		}
	}
</script>

<div class="content">
	{#await getMee()}
		<IconSpinner width="200px" />
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
	.pageIntro {
		margin-bottom: 36px;
	}
</style>
