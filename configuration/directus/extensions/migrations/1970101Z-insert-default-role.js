export async function up(knex) {
    await knex('directus_roles').insert({
        id: process.env.CMS_DIRECTUS_DEFAULT_ROLE_ID,
        name: process.env.CMS_DIRECTUS_DEFAULT_ROLE_NAME,
        icon: 'supervised_user_circle',
        description: 'default role used to disptach IDP users',
        ip_access: null,
        enforce_tfa: 0,
        admin_access: 0,
        app_access: 1,
    });

    console.log(`The ${process.env.CMS_DIRECTUS_DEFAULT_ROLE_NAME} role has been added.`);
}

export async function down(knex) {
    await knex('directus_roles')
        .where('id', process.env.CMS_DIRECTUS_DEFAULT_ROLE_ID)
        .del();
}