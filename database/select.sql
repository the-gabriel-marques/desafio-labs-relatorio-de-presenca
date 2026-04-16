-- Total de inscritos
SELECT 
    e.descricao AS evento,
    COUNT(i.id) AS total_inscritos
FROM eventos e
LEFT JOIN inscricoes i ON i.evento_id = e.id
WHERE e.descricao = 'Workshop Node.js';

-- Total de presentes
SELECT 
    e.descricao AS evento,
    COUNT(i.id) AS total_presentes
FROM eventos e
JOIN inscricoes i ON i.evento_id = e.id
WHERE e.descricao = 'Workshop Node.js'
AND i.presente = 1;

-- Total de pessoas que faltaram
SELECT 
    e.descricao AS evento,
    COUNT(i.id) AS total_faltaram
FROM eventos e
JOIN inscricoes i ON i.evento_id = e.id
WHERE e.descricao = 'Workshop Node.js'
AND i.presente = 0;