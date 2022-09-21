<script>
    import { each } from "svelte/internal";

    export let title = 'Tidligere arbeidsforhold i VTFK'
    export let backgroundColor = '--catSkillWhite'
    export let positions = []
</script>

<div class="panel" style="background-color: var({backgroundColor});">
    <div id="header"><h3 class="title">{title}</h3></div>
    <div id="content">
        <ul>
            {#each positions as position}
                <li>
                    {position.stillingstittel ?? 'Ukjent tittel'} ({Math.ceil(position.lonnsprosent/100)}%) - {position.arbeidssted?.navn ?? 'Ukjent avdeling'} - {position.arbeidsforholdsperiode?.start ? position.arbeidsforholdsperiode?.start.split('-')[0] : 'Ukjent start-år'}
                </li>
            {/each}
        </ul>
    </div>
</div>

<style>
    .panel {
        margin-bottom: 32px;
        padding: 40px 32px;
    }
    .title {
        margin: 0 0 16px 0;
    }
</style>
