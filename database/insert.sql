-- INSCRITOS
INSERT INTO inscritos (nome, telefone, email, data_nascimento) VALUES
('Ana Souza', '73999990001', 'ana@email.com', '1995-02-10'),
('Bruno Lima', '73999990002', 'bruno@email.com', '1990-06-21'),
('Carla Mendes', '73999990003', 'carla@email.com', '1988-11-03'),
('Daniel Rocha', '73999990004', 'daniel@email.com', '1992-09-15'),
('Eduarda Alves', '73999990005', 'eduarda@email.com', '1997-01-30'),
('Felipe Costa', '73999990006', 'felipe@email.com', '1993-07-12'),
('Gabriela Santos', '73999990007', 'gabriela@email.com', '1996-05-25'),
('Helena Martins', '73999990008', 'helena@email.com', '1994-03-18'),
('Igor Fernandes', '73999990009', 'igor@email.com', '1991-08-27'),
('Juliana Costa', '73999990010', 'juliana@email.com', '1998-12-09'),
('Kaique Souza', '73999990011', 'kaique@email.com', '1996-04-14'),
('Larissa Gomes', '73999990012', 'larissa@email.com', '1995-10-02');


-- EVENTOS
INSERT INTO eventos (descricao, data_evento, hora_evento, local, organizador, palestrante, informacoes) VALUES
('Workshop Node.js', '2026-05-10', '19:00', 'Auditório A', 'Tech Org', 'João Silva', 'Introdução ao Node'),
('Curso React', '2026-04-12', '18:00', 'Sala 2', 'Tech Org', 'Maria Souza', 'React básico'),
('Palestra DevOps', '2026-05-15', '20:00', 'Auditório B', 'Dev Group', 'Carlos Lima', 'CI/CD'),
('Treinamento QA', '2026-05-18', '19:30', 'Sala 1', 'QA Team', 'Fernanda Alves', 'Testes automatizados'),
('Curso SQL', '2026-05-20', '18:30', 'Lab 3', 'Data Org', 'Ricardo Mendes', 'Banco de dados'),
('Workshop UX Design', '2026-05-22', '17:00', 'Sala 4', 'Design Org', 'Patricia Rocha', 'Experiência do usuário'),
('Palestra Segurança', '2026-05-25', '19:00', 'Auditório C', 'Security Org', 'Lucas Costa', 'Segurança web');


-- INSCRIÇÕES + PRESENÇA
INSERT INTO inscricoes (inscrito_id, evento_id, presente, data_checkin) VALUES
(1, 1, 1, '2026-05-10 19:05'),
(2, 1, 1, '2026-05-10 19:10'),
(3, 1, 0, NULL),
(4, 1, 1, '2026-05-10 19:15'),
(5, 1, 0, NULL),
(6, 1, 1, '2026-05-10 19:20'),
(7, 1, 0, NULL),

(1, 2, 1, '2026-04-12 18:05'),
(2, 2, 0, NULL),
(3, 2, 1, '2026-04-12 18:10'),
(4, 2, 1, '2026-04-12 18:15'),
(5, 2, 0, NULL),
(6, 2, 1, '2026-04-12 18:20'),
(7, 2, 1, '2026-04-12 18:25'),

(1, 3, 0, NULL),
(3, 3, 1, '2026-05-15 20:03'),
(5, 3, 0, NULL),
(8, 3, 1, '2026-05-15 20:10'),
(9, 3, 0, NULL),
(10, 3, 0, NULL),

(2, 4, 1, '2026-05-18 19:31'),
(4, 4, 1, '2026-05-18 19:36'),
(6, 4, 0, NULL),
(8, 4, 1, '2026-05-18 19:40'),
(11, 4, 1, '2026-05-18 19:44'),
(12, 4, 0, NULL),

(1, 5, 1, '2026-05-20 18:31'),
(2, 5, 1, '2026-05-20 18:34'),
(5, 5, 1, '2026-05-20 18:37'),
(7, 5, 0, NULL),
(9, 5, 1, '2026-05-20 18:40'),
(10, 5, 1, '2026-05-20 18:43'),
(12, 5, 0, NULL),

(3, 6, 1, '2026-05-22 17:02'),
(4, 6, 1, '2026-05-22 17:04'),
(6, 6, 1, '2026-05-22 17:06'),
(8, 6, 1, '2026-05-22 17:08'),
(10, 6, 1, '2026-05-22 17:10'),
(11, 6, 1, '2026-05-22 17:12'),

(2, 7, 0, NULL),
(5, 7, 1, '2026-05-25 19:05'),
(7, 7, 1, '2026-05-25 19:08'),
(9, 7, 0, NULL),
(11, 7, 1, '2026-05-25 19:12'),
(12, 7, 0, NULL);
