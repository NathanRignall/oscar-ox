insert into venues (
        slug,
        title,
        description,
        location,
        website,
        latitude,
        longitude,
        is_published
    )
values (
        'playhouse',
        'The Playhouse',
        'Oxford Playhouse and its Burton Taylor Studio present and produce a wide range of live performance. Our programme includes the best of British and international drama, family shows, contemporary dance and music, student and amateur shows, comedy, lectures and poetry. The Playhouse produces and tours its own shows, hosts Artists in Residence and presents Playhouse Plays Out, an ongoing series of off-site events which happen at locations across the county. The theatre&#39s Participation team work with over 15,000 people each year through post show discussions, workshops, work experience, holiday schemes, a youth theatre and a young people’s theatre company. Oxford Playhouse is committed to delivering this artistic vision of being a Playhouse for everyone, inspiring people and transforming lives by cultivating and championing creativity - on our stages, in our communities, and online.',
        '11-12 Beaumont St',
        'https://www.oxfordplayhouse.com',
        51.75489113928563,
        -1.2608588900873774,
        true
    ),
    (
        'oreilly-theatre',
        'O&#39Reilly Theatre',
        'The O&#39Reilly is one of Oxford&#39s newest student theatres — it opened in 2002 and is located in the grounds of Keble College. It has a seating capacity of roughly 200 (depending on configuration) and its technical capabilities and range of staging options make it one of the most popular performance spaces in Oxford, with its three termly performance slots much sought after by student companies. The O&#39Reilly has excellent technical facilities: all productions in the space have access to an extensive lighting rig and sound equipment, as well as video projection technology. Seating can be rearranged to allow for plays in round, thrust and traverse formations. There are also two balconies, one of which can be used to seat orchestras or bands. For more information about the technical side of the O&#39Reilly, email Keziah Owusu-Attuahene [keziah.owusu-attuahene@keble.ox.ac.uk].',
        'College, Blackhall Road',
        'https://www.oreillytheatre.co.uk/',
        51.75865678903782,
        -1.2587382186045732,
        true
    ),
    (
        'auditorium',
        'The Auditorium',
        'Its a thing that exists',
        'Moorbottom Road',
        'https://nhgs.co.uk',
        51.75348591143385,
        -1.2702853163684737,
        true
    );
insert into roles (slug, title, description, is_published)
values ('actor', 'Actor', 'The Role Description', true),
    (
        'director',
        'Director',
        'The Role Description',
        true
    ),
    (
        'title',
        'Stage Manager',
        'The Role Description',
        true
    ),
    (
        'lighting-designer',
        'Lighting Designer',
        'The Role Description',
        true
    ),
    (
        'sound-designer',
        'Sound Designer',
        'The Role Description',
        true
    ),
    (
        'set-designer',
        'Set Designer',
        'The Role Description',
        true
    ),
    (
        'costume-designer',
        'Costume Designer',
        'The Role Description',
        true
    ),
    (
        'choreographer',
        'Choreographer',
        'The Role Description',
        true
    ),
    (
        'musician',
        'Musician',
        'The Role Description',
        true
    ),
    (
        'dancer',
        'Dancer',
        'The Role Description',
        true
    ),
    (
        'producer',
        'Producer',
        'The Role Description',
        true
    ),
    (
        'writer',
        'Writer',
        'The Role Description',
        true
    ),
    (
        'crew',
        'Crew',
        'The Role Description',
        true
    );
insert into categories (title)
values ('Actor'),
    ('Crew'),
    ('Band');