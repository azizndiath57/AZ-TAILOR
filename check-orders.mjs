import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function checkLatestOrder() {
  const { data, error } = await supabase
    .from('orders')
    .select('id, garmentType, fabricText, fabricPhotoUrl')
    .order('created_at', { ascending: false })
    .limit(5);

  if (error) {
    console.error("Error fetching orders:", error);
  } else {
    console.log("Latest orders:");
    console.log(JSON.stringify(data, null, 2));
  }
}

checkLatestOrder();
