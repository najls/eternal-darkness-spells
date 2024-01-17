const spells = {
    'enchant': ['antorbok', 'magormor'],
    'recover': ['narokath', 'santak'],
    'reveal': ['narokath', 'redgormor'],
    'field': ['bankorok', 'redgormor'],
    'dispel': ['nethlek', 'redgormor'],
    'summon': ['tier', 'aretak'],
    'shield': ['bankorok', 'santak'],
    'attack': ['antorbok', 'redgormor'],
    'pool': ['tier', 'redgormor'],
    'bind': ['bankorok', 'aretak']
};
const entities = document.querySelectorAll('.rune, .spell');
const mantorok = document.getElementById('mantorok');
const pargon = document.getElementById('pargon');
const summon = document.getElementById('summon');

document.getElementById('name').addEventListener('click', toggleDisplay);
document.getElementById('translate').addEventListener('click', toggleDisplay);
document.getElementById('add').addEventListener('click', toggleDeselectOther);
document.getElementById('reset').addEventListener('click', resetTable);

var deselectOther = true;

Array.from(entities).forEach(entity => {
    entity.addEventListener('click', function() {
        if (this.dataset.type === 'spell') selectRunes(this);
        else { /* rune or alignment */
            if (this.classList.toggle('selected'))
                if (deselectOther) deselectAll(this.dataset.type, this);
            if (this.dataset.type === 'alignment') setAlignment();
        }
        selectSpells();
    });
});

function selectRunes(entity) {
    /* if inactive summon spell is selected */
    if (entity.classList.contains('unavailable')) {
        entity.classList.remove('unavailable');
        mantorok.classList.remove('selected');
        setAlignment();
    }
    spells[entity.id].forEach(rune => {
        let elem = document.getElementById(rune);
        /* if spell is being deselected */
        if (entity.classList.contains('selected')) {
            elem.classList.remove('selected');
            /* if we're not in add mode and only pargon remains we deselect it as well */
            if (deselectOther && document.querySelectorAll("[data-type='verb'].selected, [data-type='noun'].selected").length === 0)
                pargon.classList.remove('selected');
        }
        else elem.classList.add('selected');
        if (deselectOther) deselectAll(elem.dataset.type, elem);
    });
}

function selectSpells() {
    let selectedRunes = document.querySelectorAll("[data-type='verb'].selected, [data-type='noun'].selected");
    deselectAll('spell');
    if (deselectOther) {
        if (document.body.className === 'unaligned') setInactiveAll('alignment');
        if (!pargon.classList.contains('selected')) pargon.classList.add('inactive');
        else clearInactiveAll('pargon');
        setInactiveAll('spell');
        Array.from(selectedRunes).forEach(rune => setInactiveAll(rune.dataset.type, rune));
        if (selectedRunes.length === 1) selectedRunes[0].dataset.type === 'verb' ? setInactiveAll('noun') : setInactiveAll('verb');
        for (const [spell, runes] of Object.entries(spells)) {
            /* The binding of Mantorok has weakened it, and it can no longer fuel incantations of this kind. */
            if (document.body.className === 'mantorok' && spell === 'summon') continue;
            /* if the spell includes all selected runes (one or two) */
            if (Array.from(selectedRunes).every(rune => runes.includes(rune.id))) {
                clearInactiveAll('alignment');
                clearInactiveAll('pargon');
                runes.forEach(rune => document.getElementById(rune).classList.remove('inactive'));
                document.getElementById(spell).classList.remove('inactive');
                if (selectedRunes.length === 2) document.getElementById(spell).classList.add('selected');
            }
        }
    }
    else {
        for (const [spell, runes] of Object.entries(spells)) {
            /* if selected include all required runes for the spell */
            if (runes.every(rune => Array.from(selectedRunes).includes(document.getElementById(rune)))) {
                let elem = document.getElementById(spell);
                if (!elem.classList.contains('unavailable')) elem.classList.add('selected');
            }
        }
    }
    /* The Mantorok rune cannot be used in Summoning magicks. */
    if (summon.classList.contains('selected')) {
        mantorok.classList.remove('selected');
        mantorok.classList.add('unavailable');
        setAlignment();
    }
    else {
        mantorok.classList.remove('unavailable');
        setAlignment();
    }
}

function deselectAll(type, except) {
    Array.from(entities).forEach(entity => {
        if (entity.dataset.type === type && !entity.isSameNode(except)) entity.classList.remove('selected');
    });
}

function setInactiveAll(type, except) {
    Array.from(entities).forEach(entity => {
        if (entity.dataset.type === type)
            entity.isSameNode(except) ? entity.classList.remove('inactive') : entity.classList.add('inactive');
    });
}

function clearInactiveAll(type) {
    Array.from(entities).forEach(entity => {
        if (entity.dataset.type === type) entity.classList.remove('inactive');
    });
}

function setAlignment() {
    let alignments = [];
    Array.from(document.querySelectorAll("[data-type='alignment'].selected")).forEach(alignment => {
        if (deselectOther) setInactiveAll('alignment', alignment);
        alignments.push(alignment.id);
    });
    if (alignments.includes('mantorok')) {
        document.body.className = 'mantorok';
        document.getElementById('mantorok').classList.remove('unavailable');
        summon.classList.add('unavailable');
    }
    else {
        switch (alignments.length) {
            case 1:
                document.body.className = alignments[0];
                break;
            case 2:
                if (['chatturgha', 'ulyaoth'].every(value => alignments.includes(value))) document.body.className = 'ulyaoth';
                if (['ulyaoth', 'xellotath'].every(value => alignments.includes(value))) document.body.className = 'xellotath';
                if (['xellotath', 'chatturgha'].every(value => alignments.includes(value))) document.body.className = 'chatturgha';
                break;
            default:
                document.body.className = 'unaligned';
        }
        summon.classList.remove('unavailable');
    }
}

function resetTable(resetAlignment = true) {
    Array.from(entities).forEach(entity => {
        if (!(entity.dataset.type === 'alignment' && !resetAlignment))
            entity.classList.remove('inactive', 'unavailable', 'selected', 'blind');
    });
    if (resetAlignment) document.body.className = 'unaligned';
}

function toggleDisplay(e) {
    e.target.classList.toggle('active');
    let targetElements = document.getElementsByClassName(e.target.dataset.target);
    Array.from(targetElements).forEach(elem => {
        elem.classList.toggle('display-none');
    });
}

function toggleDeselectOther(e) {
    e.target.classList.toggle('active');
    deselectOther = deselectOther === false;
    if (deselectOther) {
        let spell = document.getElementsByClassName('spell selected')[0];
        if (spell) {
            resetTable(false);
            setAlignment();
            selectRunes(spell);
            selectSpells();
        }
    }
    else Array.from(entities).forEach(entity => entity.classList.remove('inactive'));
}
