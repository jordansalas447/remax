// scripts/generateCrudFiles.ts
import { readFileSync, writeFileSync, mkdirSync, existsSync } from 'fs';
import { join } from 'path';

// Absolute path to the project root
const projectRoot = 'C:/Users/Usuario/Documents/remax-adelante-app';
const dbTypesPath = join(projectRoot, 'database.types.ts');
const queriesDir = join(projectRoot, 'lib', 'supabase', 'queries');

if (!existsSync(queriesDir)) {
  mkdirSync(queriesDir, { recursive: true });
}

function toPascal(str: string): string {
  return str
    .split('_')
    .map(p => p.charAt(0).toUpperCase() + p.slice(1))
    .join('');
}

const fileContent = readFileSync(dbTypesPath, 'utf8');
const tablesBlockMatch = fileContent.match(/Tables:\s*{([\s\S]*?)}\s*,/);
if (!tablesBlockMatch) {
  console.error('Could not locate Tables block in database.types.ts');
  process.exit(1);
}
const tablesBlock = tablesBlockMatch[1];
const tableNames = Array.from(tablesBlock.matchAll(/(\w+):\s*{/g)).map(m => m[1]);

for (const tableName of tableNames) {
  const pascal = toPascal(tableName);
  const filePath = join(queriesDir, `${tableName}.ts`);
  const content = `import { createClient } from '@/lib/supabase/client';
import type { Database } from '@/database.types';

export type ${pascal}Row = Database['public']['Tables']['${tableName}']['Row'];
export type ${pascal}Insert = Database['public']['Tables']['${tableName}']['Insert'];
export type ${pascal}Update = Database['public']['Tables']['${tableName}']['Update'];

export async function selectAll(): Promise<${pascal}Row[]> {
  const supabase = createClient();
  const { data, error } = await supabase.from('${tableName}').select('*');
  if (error) throw error;
  return data as ${pascal}Row[];
}

export async function selectById(id: number): Promise<${pascal}Row | null> {
  const supabase = createClient();
  const { data, error } = await supabase.from('${tableName}').select('*').eq('id', id).single();
  if (error) throw error;
  return data as ${pascal}Row | null;
}

export async function insert(row: ${pascal}Insert): Promise<${pascal}Row> {
  const supabase = createClient();
  const { data, error } = await supabase.from('${tableName}').insert(row).single();
  if (error) throw error;
  return data as ${pascal}Row;
}

export async function update(id: number, row: ${pascal}Update): Promise<${pascal}Row> {
  const supabase = createClient();
  const { data, error } = await supabase.from('${tableName}').update(row).eq('id', id).single();
  if (error) throw error;
  return data as ${pascal}Row;
}

export async function remove(id: number): Promise<void> {
  const supabase = createClient();
  const { error } = await supabase.from('${tableName}').delete().eq('id', id);
  if (error) throw error;
}
`;
  writeFileSync(filePath, content, { encoding: 'utf8' });
  console.log(`Generated ${filePath}`);
}

console.log('CRUD file generation completed.');
