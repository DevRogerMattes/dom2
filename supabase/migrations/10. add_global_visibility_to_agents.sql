-- Migration: Add global_visibility field to agents table
ALTER TABLE public.agents ADD COLUMN global_visibility CHAR(1);

-- Optional: Set default to NULL (not visible to all), or 'U' for universal/global
-- UPDATE public.agents SET global_visibility = 'U' WHERE ...;

-- Add comment for documentation
COMMENT ON COLUMN public.agents.global_visibility IS 'Se for U, agente é global (visível para todos e não pode ser editado/deletado pelo app)';
