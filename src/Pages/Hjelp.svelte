<script>
	import Card from "../components/Card.svelte";
	import { infoCard, moreCard, gdprCard, dataCard } from "../lib/Helpers/helptexts"
	

	const name = 'Hjelp';
	const dataTitle = 'Hvem kan se mine data?'
	const dataBackgroundColor = '--luft-2'
	const personvernTitle = 'GDPR og personvern'
	const personvernBackgroundColor = '--varme-2'
	const infoTitle = 'Informasjon'
	const infoBackgroundColor = '--gress-2'
	const merTitle = 'Vil du lese mer?'
	const merBackgroundColor = '--zanah'
	const veilederTitle = 'Veileder'
	const veilederBackgroundColor = '--white'
	
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
		{moreCard} <a href="https://vtfk.sharepoint.com/sites/innsida-varorganisasjon/SitePages/Vibyggernyefylker.aspx">her.</a>
	</Card>
	<Card title={veilederTitle} editable={false} backgroundColor={veilederBackgroundColor}>
		<div>
			<img src="src\assets\veileder.png" alt="veileder"/>
		</div>
		<dl>
			<dt>1. Spørsmålstegn</dt>
				<dd>Brukes til å åpne og lukke informasjonsteksten om det gjeldene kortet.</dd><br>
				<dd>I informasjonsteksten finner du informasjon om det kortet du er på, her kan du finne informasjon relevant til den dataen vi ønsker å samle inn og hvorfor vi ønsker nettopp denne informasjonen om deg. </dd><br>
			<dt>2. X-ikon</dt>
				<dd>Brukes til å lukke informasjonsteksten om det gjeldene kortet</dd><br>
			<dt>3. Søppelkasse-ikon</dt>
				<dd>Ved å trykke på ikonet vil du fjerne feltet. NB! Det blir ikke fjernet før du faktisk trykker på lagre(9).</dd><br>
			<dt>4. Legg til knappen </dt>
				<dd>Når du trykker på denne knappen vil du legge til et nytt felt, merk at dette feltet vil være obligatorisk å fylle inn selv om du alt har fylt inn feltet som står over.</dd><br>
			<dt>5. Rolle</dt>
				<dd>Om et felt ikke er fylt ut, men obligatorisk å fylle ut vil det være en rød * enten bak navnet på feltet eller bak selve feltet. I tillegg til den røde stjernen vil feltet også være markert i rød for å indikere at feltet er obligatorisk.</dd><br>
			<dt>6. Fjern-knappen</dt>
				<dd>I dette tilfellet vil fjernknappen fjerne hele kortet som inneholder informasjon om den rollen og de oppgavene som hører til denne rollen. </dd><br>
			<dt>7. Legg til knappen </dt>
				<dd>I dette tilfellet vil legg til knappen legge til et helt kort som gir deg mulighet til å legge til informasjon om den rollen du har hatt og de oppgavene som hørte til denne rollen.</dd><br>
			<dt>8. Lagre og Avbryt</dt>
				<dd>Ved å trykke på lagre knappen lagrer du alle endringene du har gjort i kortet. Om knappen er grå og du ikke får trykket på den betyr det at du ikke har fylt ut alle de obligatoriske feltene.</dd><br>
				<dd>Ved å trykke på avbryt knappen vil du avbryte redigeringen i kortet og alle endringene du har gjort vil forsvinne, disse er ikke mulig å hente tilbake. Lagre ofte og heller en gang for mye enn en gang for lite. </dd><br>
		</dl>
		<br>
		<div>
			<img src="src\assets\veilderDatalist.png" alt="veileder2"/>
		</div>
		<dl>
		<dt>9. Dataliste</dt>
			<dd>I denne listen kan du skrive for å søke og få opp predefinerte valg.</dd>
			<dd>Om du ikke finner det du søker etter kan du skrive inn det du mener passer.</dd><br>
		</dl>
		<br>
		<div>
			<img src="src\assets\veilederPågår.png" alt="veileder3"/>
		</div>
		<dl>
		<dt>10. Pågår/Ingen Utløpsdato</dt>
			<dd>Denne sjekkboksen finner du flere steder i kompetanse-verktøyet, denne gir deg mulighet til å si noe om en sluttdato eller utløpsdato.</dd>
			<dd>Om sjekkboksen ikke er krysset av må du velge en slutt dato.</dd><br>
		</dl>		
	</Card>
</div>

<style>
	dt {
		font-size: 18px;
		line-height: 24px;
		min-height: 24px;	
	}
	
	dd  {
		font-size: 16px;
		line-height: 24px;
		min-height: 24px;
		margin-left: 2rem;
	}
</style>
