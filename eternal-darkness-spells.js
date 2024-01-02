const spellDict = {
    'chatturgha enchant': ['chatturgha', 'antorbok', 'magormor', 'pargon'],
    'chatturgha recover': ['chatturgha', 'narokath', 'santak', 'pargon'],
    'chatturgha reveal': ['chatturgha', 'narokath', 'redgormor', 'pargon'],
    'chatturgha field': ['chatturgha', 'bankorok', 'redgormor', 'pargon'],
    'chatturgha dispel': ['chatturgha', 'nethlek', 'redgormor', 'pargon'],
    'chatturgha summon': ['chatturgha', 'tier', 'aretak', 'pargon'],
    'chatturgha shield': ['chatturgha', 'bankorok', 'santak', 'pargon'],
    'chatturgha attack': ['chatturgha', 'antorbok', 'redgormor', 'pargon'],
    'chatturgha pool': ['chatturgha', 'tier', 'redgormor', 'pargon'],
    'chatturgha bind': ['chatturgha', 'bankorok', 'aretak', 'pargon'],
    'ulyaoth enchant': ['ulyaoth', 'antorbok', 'magormor', 'pargon'],
    'ulyaoth recover': ['ulyaoth', 'narokath', 'santak', 'pargon'],
    'ulyaoth reveal': ['ulyaoth', 'narokath', 'redgormor', 'pargon'],
    'ulyaoth field': ['ulyaoth', 'bankorok', 'redgormor', 'pargon'],
    'ulyaoth dispel': ['ulyaoth', 'nethlek', 'redgormor', 'pargon'],
    'ulyaoth summon': ['ulyaoth', 'tier', 'aretak', 'pargon'],
    'ulyaoth shield': ['ulyaoth', 'bankorok', 'santak', 'pargon'],
    'ulyaoth attack': ['ulyaoth', 'antorbok', 'redgormor', 'pargon'],
    'ulyaoth pool': ['ulyaoth', 'tier', 'redgormor', 'pargon'],
    'ulyaoth bind': ['ulyaoth', 'bankorok', 'aretak', 'pargon'],
    'xellotath enchant': ['xellotath', 'antorbok', 'magormor', 'pargon'],
    'xellotath recover': ['xellotath', 'narokath', 'santak', 'pargon'],
    'xellotath reveal': ['xellotath', 'narokath', 'redgormor', 'pargon'],
    'xellotath field': ['xellotath', 'bankorok', 'redgormor', 'pargon'],
    'xellotath dispel': ['xellotath', 'nethlek', 'redgormor', 'pargon'],
    'xellotath summon': ['xellotath', 'tier', 'aretak', 'pargon'],
    'xellotath shield': ['xellotath', 'bankorok', 'santak', 'pargon'],
    'xellotath attack': ['xellotath', 'antorbok', 'redgormor', 'pargon'],
    'xellotath pool': ['xellotath', 'tier', 'redgormor', 'pargon'],
    'xellotath bind': ['xellotath', 'bankorok', 'aretak', 'pargon'],
    'mantorok enchant': ['mantorok', 'antorbok', 'magormor', 'pargon'],
    'mantorok recover': ['mantorok', 'narokath', 'santak', 'pargon'],
    'mantorok reveal': ['mantorok', 'narokath', 'redgormor', 'pargon'],
    'mantorok field': ['mantorok', 'bankorok', 'redgormor', 'pargon'],
    'mantorok dispel': ['mantorok', 'nethlek', 'redgormor', 'pargon'],
    'mantorok shield': ['mantorok', 'bankorok', 'santak', 'pargon'],
    'mantorok attack': ['mantorok', 'antorbok', 'redgormor', 'pargon'],
    'mantorok pool': ['mantorok', 'tier', 'redgormor', 'pargon'],
    'mantorok bind': ['mantorok', 'bankorok', 'aretak', 'pargon']
};
const entities = document.querySelectorAll('.rune, .spell');
var blindMode = false;

document.getElementById('name').addEventListener('click', toggleDisplay);
document.getElementById('translate').addEventListener('click', toggleDisplay);
document.getElementById('blind').addEventListener('click', toggleBlindMode);
document.getElementById('reset').addEventListener('click', resetTable);

Array.from(entities).forEach(entity => {
    entity.addEventListener('click', function() {
        /* if a spell was clicked */
        if (this.dataset.type === 'spell') {
            /* if spell was deselected reset table except for alignment */
            if (!this.classList.toggle('selected')) {
                resetTable(false);
            }
            /* if spell was selected we select the corresponding verb and noun instead */
            else {
                deselect('verb');
                deselect('noun');
                spellDict[`chatturgha ${this.id}`].slice(1, 3).forEach(rune => { /* alignment doesn't matter here as we're just interested in the verb and noun */
                    document.getElementById(rune).classList.add('selected');
                });
                /* special mantorok case for summon */
                if (this.id === 'summon' && document.body.className === 'mantorok') {
                    deselect('alignment');
                    document.body.className = 'unaligned';
                }
            }
        }
        /* if any other entity was selected */
        else if (this.classList.toggle('selected')) {
            if (this.dataset.type === 'alignment') { /* set alignment color */
                document.body.className = this.id;
            }
            deselect(this.dataset.type, this);
        }
        /* if any entity was deselected */
        else if (this.dataset.type === 'alignment') { /* reset alignment color */
            document.body.className = 'unaligned';
        }
        deselect('spell');
        toggleInactive();
        /* if only one spell is active and both a verb and a noun is selected we select the active spell */
        let activeSpells = document.querySelectorAll('.spell:not(.inactive)');
        if (activeSpells.length === 1 && document.querySelectorAll("[data-type='verb'].selected, [data-type='noun'].selected").length === 2) {
            activeSpells[0].classList.add('selected');
        }
    });
});

function deselect(type, except) {
    Array.from(entities).forEach(entity => {
        if (entity.dataset.type === type && !entity.isSameNode(except)) {
            entity.classList.remove('selected');
        }
    });
}

function toggleInactive() {
    let selectedRunes = [];
    let possibleSpells = [];
    let activeRunes = [];
    Array.from(document.getElementsByClassName('rune selected')).forEach(rune => {
        selectedRunes.push(rune.id);
    });
    for (const [spell, runes] of Object.entries(spellDict)) {
        if (selectedRunes.every(rune => runes.includes(rune))) {
            possibleSpells.push([spell.split(' ')[1], ...runes]); /* split spell key to get id without alignment */
        }
    }
    activeRunes = union(...possibleSpells);
    Array.from(document.querySelectorAll('.rune, .spell')).forEach(rune => {
        rune.classList.remove('inactive', 'blind');
        if (!activeRunes.includes(rune.id) && !rune.classList.contains('selected')) {
            rune.classList.add('inactive');
            if (blindMode) rune.classList.add('blind');
        }
    });
}

function toggleDisplay(e) {
    e.target.classList.toggle('active');
    let targetElements = document.getElementsByClassName(e.target.dataset.target);
    Array.from(targetElements).forEach(elem => {
        elem.classList.toggle('display-none');
    });
}

function toggleBlindMode(e) {
    e.target.classList.toggle('active');
    blindMode = blindMode ? false : true;
    toggleInactive();
}

function resetTable(resetAlignment = true) {
    Array.from(entities).forEach(entity => {
        if (!(entity.dataset.type === 'alignment' && !resetAlignment)) {
            entity.classList.remove('inactive', 'selected', 'blind');
        }
    });
    if (resetAlignment) {
        document.body.className = 'unaligned';
    }
}

function union() {
    let flat = [].concat(...arguments);
    return [...new Set(flat)];
}
