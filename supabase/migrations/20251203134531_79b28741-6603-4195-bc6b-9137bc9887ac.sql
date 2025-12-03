-- Fix cases table RLS to restrict visibility to assigned parties only
DROP POLICY IF EXISTS "Authenticated users can view cases" ON cases;

CREATE POLICY "Users can view assigned cases"
ON cases FOR SELECT
USING (
  auth.uid() = created_by
  OR auth.uid() = petitioner_lawyer_id
  OR auth.uid() = respondent_lawyer_id
  OR auth.uid() = assigned_judge_id
  OR has_role(auth.uid(), 'admin'::app_role)
);

-- Also fix case_documents to restrict to case parties
DROP POLICY IF EXISTS "Users can view case documents" ON case_documents;

CREATE POLICY "Users can view documents for their cases"
ON case_documents FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM cases
    WHERE cases.id = case_documents.case_id
    AND (
      cases.created_by = auth.uid()
      OR cases.petitioner_lawyer_id = auth.uid()
      OR cases.respondent_lawyer_id = auth.uid()
      OR cases.assigned_judge_id = auth.uid()
    )
  )
  OR has_role(auth.uid(), 'admin'::app_role)
);

-- Fix case_schedules to restrict to case parties
DROP POLICY IF EXISTS "Users can view schedules" ON case_schedules;

CREATE POLICY "Users can view schedules for their cases"
ON case_schedules FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM cases
    WHERE cases.id = case_schedules.case_id
    AND (
      cases.created_by = auth.uid()
      OR cases.petitioner_lawyer_id = auth.uid()
      OR cases.respondent_lawyer_id = auth.uid()
      OR cases.assigned_judge_id = auth.uid()
    )
  )
  OR has_role(auth.uid(), 'admin'::app_role)
  OR has_role(auth.uid(), 'judge'::app_role)
);

-- Fix case_reassignment_log to restrict to case parties
DROP POLICY IF EXISTS "Users can view reassignment logs" ON case_reassignment_log;

CREATE POLICY "Users can view reassignment logs for their cases"
ON case_reassignment_log FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM cases
    WHERE cases.id = case_reassignment_log.case_id
    AND (
      cases.created_by = auth.uid()
      OR cases.petitioner_lawyer_id = auth.uid()
      OR cases.respondent_lawyer_id = auth.uid()
      OR cases.assigned_judge_id = auth.uid()
    )
  )
  OR has_role(auth.uid(), 'admin'::app_role)
  OR has_role(auth.uid(), 'judge'::app_role)
);