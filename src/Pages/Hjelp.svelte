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
		<!--{gdprCard} <a href="https://vtfk.sharepoint.com/:w:/s/BDK-BNFHR/ESD8OQFbBr9Ph-9aEzFZBlYBg26I2JJjKgAF9_WuTueWZQ?e=2AqMbD">Personvernerklæring</a>-->
		{gdprCard} <a href="./kompetansePersonvern.pdf" download="kompetansePersonvern.pdf">Personvernerklæring</a>
	</Card>
	<Card title={dataTitle} editable={false} backgroundColor={dataBackgroundColor}>
		{dataCard}
	</Card>
	<Card title={merTitle} editable={false} backgroundColor={merBackgroundColor}>
		{moreCard} <a href="https://vtfk.sharepoint.com/sites/innsida-varorganisasjon/SitePages/Vibyggernyefylker.aspx">her.</a>
	</Card>
	<hr/>
	<Card title={veilederTitle} editable={false} backgroundColor={veilederBackgroundColor}>
		<div>
			<img src="veileder.png" alt="veileder"/>
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
			<img src="veilderDatalist.png" alt="veileder2"/>
		</div>
		<dl>
		<dt>9. Dataliste</dt>
			<dd>I denne listen kan du skrive for å søke og få opp predefinerte valg.</dd>
			<dd>Om du ikke finner det du søker etter kan du skrive inn det du mener passer.</dd><br>
		</dl>
		<br>
		<div>
			<img src="veilederPagar.png" alt="veileder3"/>
		</div>
		<dl>
		<dt>10. Pågår/Ingen Utløpsdato</dt>
			<dd>Denne sjekkboksen finner du flere steder i kompetanse-verktøyet, denne gir deg mulighet til å si noe om en sluttdato eller utløpsdato.</dd>
			<dd>Om sjekkboksen ikke er krysset av må du velge en slutt dato.</dd><br>
		</dl>		
	</Card>

	<hr/>
	<br>

	<!-- Guide for leder ved kartleggingssamtale -->
	<h2>Hvordan utføre en kartleggingssamtale</h2> <br>
	<dl>
		<dt>1. Naviger til min enhet</dt>
			<dd>Naviger til "Min enhet" ved å trykke på knappen som er markert på bilde under.</dd>
			<dd>Derreter trykker du på den personen du ønsker å utføre en kartleggingssamtale med.</dd>
	</dl>
	<br>
	<div style="width: 500px; margin-left:3rem;">
		<img height="600" src="minEnhetNavigasjon.png" alt="kartleggingssamtale1"/>
	</div>
	<br>
	<hr/>
	<dl>
		<dt>2. Ansattinformasjon siden</dt>
			<dd>Når du har trykket på den personen du ønsker å utføre en kartleggingssamtale med vil du bli sendt videre til personen sin "Ansattinformasjon" side.</dd>
			<dd>Der vil du se en lyseblå boks med overskriften "Lederverktøy: Kartleggingssamtale" som vist på bilde under.</dd>
			<dd>I denne boksen finner du litt informasjon og to knapper og oversikt over historikken til den ansatte.</dd>
			<br>
			<dl>Historikken vil vise følgende:
				<dd>1. Når kartleggingssamtalen ble gjennomført.</dd>
				<dd>2. Status på kartleggingssamtalen. Status kan enten være "Godkjent", "Ikke godkjent" eller "Venter på signering"</dd>
				<dd>3. Hvem som er ansvarlig for kartleggingssamtalen.</dd>
				<dd>4. Arkivstatus for kartleggingssamtalen. Her kan kartleggingssamtalen enten være manuelt arkivert eller automatisk arkivert. Normalt vil samtalen automatisk arkiveres.</dd>
			</dl>
			<br>
			<dd>For å starte en kartleggingssamtale må du først logge på skjemaløsningen, dette gjør du ved å trykke på knappen "Logg på internskjema.vtfk.no"</dd>
	</dl>
	<br>
	<div>
		<img src="ansattinformasjon2v2.png" alt="kartleggingssamtale2"/>
	</div>
	<br>
	<h3>Historikk eksempler</h3>
	<div class="historyImg">
		<div>
			<img src="historikkGodkjent.png" alt="historikk1"/>
		</div> 
		<div>
			<img src="historikkIkkeGodkjent.png" alt="historikk3"/>
		</div>
		<div>
			<img src="historikkVenter.png" alt="historikk2"/>
		</div>
	</div>
	<br>
	<hr/>
	<dl>
		<dt>3. Skjemaløsningen</dt>
			<dd>Når du har gjort dette vil du bli videresendt til en side som ser slik ut som på bildet under.</dd>
			<dd>Denne siden kan du bare krysse ut. (NB! Ikke logg ut!)</dd>
	</dl>
	<br>
	<div>
		<img src="acosSkjemaliste.png" alt="kartleggingssamtale3"/>
	</div>
	<br>
	<hr/>
	<dl>
		<dt>4. Tilbake i kompetansemodulen</dt>
		<dd>Tilbake i kompetansemodulen vil du se at boksen som du så tidligere har endret seg. Se bilde under.</dd>
		<dd>Boksen har nå fått en ny knapp "Opprett kartleggingssamtale for 'Navn på ansatt'" </dd>
		<dd>Dette betyr at du kan starte en kartleggingssamtale for den ansatte ved å trykke på denne kanppen</dd>
	</dl>
	<br>
	<div>
		<img src="ansattinformasjonEndret.png" alt="kartleggingssamtale4"/>
	</div>
	<br>
	<hr/>
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

img {
	width: 100%;
}

.historyImg {
	display: flex;
	justify-content:space-around;
}

hr {
	display: block;
	height: 1px;
	border: 0;
	border-top: 1px solid #ccc;
	margin: 1em 0;
	padding: 0;
}	
</style>
