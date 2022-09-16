<script>
	import PersonCard from '../components/PersonCard.svelte'
	let name = 'Hjelp';
</script>

<div class="content">
	<PersonCard />
	<h1>{name}!</h1>
	<p>Her kan du få hjelp. www.google.no </p>
</div>

<style>
	h1 {
		color: var(--deepSeaGreen);
	}
	
	.content {
		padding-top: 1rem
	}

</style>