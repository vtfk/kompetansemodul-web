<script>
  import Card from "../components/Card.svelte";
  import { infoCard, moreCard, gdprCard, dataCard } from "../lib/Helpers/helptexts"

	let name = 'Hjelp';
	let dataTitle = 'Hvem kan se mine data?'
	let dataBackgroundColor = '--varme-2'
	let personvernTitle = 'GDPR og personvern'
	let personvernBackgroundColor = '--luft-2'
	let infoTitle = 'Informasjon'
	let infoBackgroundColor = '--gress-2'
	let merTitle = 'Vil du lese mer?'
	let merBackgroundColor = '--zanah'
</script>

<div class="content">
	<h1>{name}</h1><br>
	<Card title={infoTitle} editable={false} backgroundColor={infoBackgroundColor}>
		{infoCard}
	</Card>
	<Card title={personvernTitle} editable={false} backgroundColor={personvernBackgroundColor}>
		{gdprCard} <a href="https://vtfk.sharepoint.com/:w:/s/BDK-BNFHR/ESD8OQFbBr9Ph-9aEzFZBlYBg26I2JJjKgAF9_WuTueWZQ?e=2AqMbD">Personvernerklæring</a>
	</Card>
	<Card title={dataTitle} editable={false} backgroundColor={dataBackgroundColor}>
		{dataCard}
	</Card>
	<Card title={merTitle} editable={false} backgroundColor={merBackgroundColor}>
		{moreCard} <a href="https://vtfk.sharepoint.com/sites/innsida-varorganisasjon/SitePages/Vibyggernyefylker.aspx">"vi bygger nye fylkeskommuner".</a>
	</Card>
</div>

<style>
</style>
