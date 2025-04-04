const { createClient } = require('@supabase/supabase-js');
const dotenv = require('dotenv');
const path = require('path');
const url = require('url');

// Configurar dotenv para cargar desde el directorio raíz del proyecto
const __filename = url.fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.resolve(__dirname, '../.env') });

const supabaseUrl = process.env.PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  throw new Error('Missing Supabase environment variables')
}

const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
})

async function setupUsers() {
  try {
    console.log('Starting user setup...')

    // 1. Primero, obtener todos los usuarios existentes
    const { data: existingUsers, error: fetchError } = await supabaseAdmin
      .from('profiles')
      .select('id, email, role')

    if (fetchError) {
      throw new Error(`Error fetching existing users: ${fetchError.message}`)
    }

    // 2. Eliminar usuarios existentes
    console.log('Removing existing users...')
    for (const user of existingUsers || []) {
      console.log(`Deleting user: ${user.email}`)
      await supabaseAdmin.auth.admin.deleteUser(user.id)
      await new Promise(resolve => setTimeout(resolve, 500)) // Pequeña pausa entre eliminaciones
    }

    // 3. Crear nuevos usuarios para cada rol
    const users = [
      {
        email: 'admin@slainte.com',
        password: 'Admin123!@#',
        name: 'Admin Usuario',
        role: 'admin'
      },
      {
        email: 'staff@slainte.com',
        password: 'Staff123!@#',
        name: 'Staff Usuario',
        role: 'staff'
      },
      {
        email: 'customer@slainte.com',
        password: 'Customer123!@#',
        name: 'Customer Usuario',
        role: 'customer'
      }
    ]

    // 4. Crear los nuevos usuarios
    console.log('\nCreating new users...')
    for (const user of users) {
      console.log(`Creating ${user.role} user: ${user.email}`)
      
      const { data, error } = await supabaseAdmin.auth.admin.createUser({
        email: user.email,
        password: user.password,
        email_confirm: true,
        user_metadata: {
          name: user.name,
          role: user.role
        }
      })

      if (error) {
        throw new Error(`Error creating ${user.role} user: ${error.message}`)
      }

      console.log(`Successfully created ${user.role} user with ID: ${data.user.id}`)
      
      // Esperar a que el perfil se cree
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      // Verificar que el perfil se creó correctamente
      const { data: profile, error: profileError } = await supabaseAdmin
        .from('profiles')
        .select('*')
        .eq('id', data.user.id)
        .single()

      if (profileError) {
        throw new Error(`Error verifying profile for ${user.role}: ${profileError.message}`)
      }

      console.log(`Profile created successfully for ${user.email}:`, profile)
      console.log('---')
    }

    console.log('\nUser setup completed successfully!')
    
  } catch (error) {
    console.error('Error in setup:', error)
  } finally {
    process.exit(0)
  }
}

setupUsers()
