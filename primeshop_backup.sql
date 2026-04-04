--
-- PostgreSQL database dump
--

\restrict is17f7QuhGdthu955AxeIzRVdZBYGthbTs0cxbkhcuUoOS6S3b24dpoFjE49wlF

-- Dumped from database version 18.0
-- Dumped by pg_dump version 18.3

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET transaction_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: cache; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.cache (
    key character varying(255) NOT NULL,
    value text NOT NULL,
    expiration integer NOT NULL
);


ALTER TABLE public.cache OWNER TO postgres;

--
-- Name: cache_locks; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.cache_locks (
    key character varying(255) NOT NULL,
    owner character varying(255) NOT NULL,
    expiration integer NOT NULL
);


ALTER TABLE public.cache_locks OWNER TO postgres;

--
-- Name: categories; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.categories (
    id bigint NOT NULL,
    name character varying(255) NOT NULL,
    slug character varying(255) NOT NULL,
    description text,
    image character varying(255),
    color character varying(255),
    status boolean DEFAULT true NOT NULL,
    created_at timestamp(0) without time zone,
    updated_at timestamp(0) without time zone
);


ALTER TABLE public.categories OWNER TO postgres;

--
-- Name: categories_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.categories_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.categories_id_seq OWNER TO postgres;

--
-- Name: categories_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.categories_id_seq OWNED BY public.categories.id;


--
-- Name: failed_jobs; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.failed_jobs (
    id bigint NOT NULL,
    uuid character varying(255) NOT NULL,
    connection text NOT NULL,
    queue text NOT NULL,
    payload text NOT NULL,
    exception text NOT NULL,
    failed_at timestamp(0) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


ALTER TABLE public.failed_jobs OWNER TO postgres;

--
-- Name: failed_jobs_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.failed_jobs_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.failed_jobs_id_seq OWNER TO postgres;

--
-- Name: failed_jobs_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.failed_jobs_id_seq OWNED BY public.failed_jobs.id;


--
-- Name: job_batches; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.job_batches (
    id character varying(255) NOT NULL,
    name character varying(255) NOT NULL,
    total_jobs integer NOT NULL,
    pending_jobs integer NOT NULL,
    failed_jobs integer NOT NULL,
    failed_job_ids text NOT NULL,
    options text,
    cancelled_at integer,
    created_at integer NOT NULL,
    finished_at integer
);


ALTER TABLE public.job_batches OWNER TO postgres;

--
-- Name: jobs; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.jobs (
    id bigint NOT NULL,
    queue character varying(255) NOT NULL,
    payload text NOT NULL,
    attempts smallint NOT NULL,
    reserved_at integer,
    available_at integer NOT NULL,
    created_at integer NOT NULL
);


ALTER TABLE public.jobs OWNER TO postgres;

--
-- Name: jobs_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.jobs_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.jobs_id_seq OWNER TO postgres;

--
-- Name: jobs_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.jobs_id_seq OWNED BY public.jobs.id;


--
-- Name: migrations; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.migrations (
    id integer NOT NULL,
    migration character varying(255) NOT NULL,
    batch integer NOT NULL
);


ALTER TABLE public.migrations OWNER TO postgres;

--
-- Name: migrations_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.migrations_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.migrations_id_seq OWNER TO postgres;

--
-- Name: migrations_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.migrations_id_seq OWNED BY public.migrations.id;


--
-- Name: order_items; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.order_items (
    id bigint NOT NULL,
    order_id bigint NOT NULL,
    product_id bigint NOT NULL,
    product_name character varying(255) NOT NULL,
    product_price numeric(10,2) NOT NULL,
    quantity integer NOT NULL,
    subtotal numeric(10,2) NOT NULL,
    created_at timestamp(0) without time zone,
    updated_at timestamp(0) without time zone
);


ALTER TABLE public.order_items OWNER TO postgres;

--
-- Name: order_items_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.order_items_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.order_items_id_seq OWNER TO postgres;

--
-- Name: order_items_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.order_items_id_seq OWNED BY public.order_items.id;


--
-- Name: orders; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.orders (
    id bigint NOT NULL,
    order_number character varying(255) NOT NULL,
    user_id bigint,
    customer_name character varying(255) NOT NULL,
    customer_email character varying(255) NOT NULL,
    customer_phone character varying(255),
    shipping_address character varying(255) NOT NULL,
    subtotal numeric(10,2) NOT NULL,
    shipping_cost numeric(10,2) DEFAULT '0'::numeric NOT NULL,
    total numeric(10,2) NOT NULL,
    status character varying(255) DEFAULT 'pending'::character varying NOT NULL,
    payment_method character varying(255),
    payment_status character varying(255) DEFAULT 'pending'::character varying NOT NULL,
    notes text,
    created_at timestamp(0) without time zone,
    updated_at timestamp(0) without time zone,
    delivery_type character varying(255) DEFAULT 'home'::character varying NOT NULL,
    stripe_session_id character varying(255),
    stripe_payment_intent character varying(255),
    CONSTRAINT orders_delivery_type_check CHECK (((delivery_type)::text = ANY ((ARRAY['home'::character varying, 'business'::character varying, 'pickup'::character varying])::text[]))),
    CONSTRAINT orders_payment_status_check CHECK (((payment_status)::text = ANY ((ARRAY['pending'::character varying, 'paid'::character varying, 'failed'::character varying, 'refunded'::character varying])::text[]))),
    CONSTRAINT orders_status_check CHECK (((status)::text = ANY ((ARRAY['pending'::character varying, 'confirmed'::character varying, 'shipped'::character varying, 'delivered'::character varying, 'cancelled'::character varying])::text[])))
);


ALTER TABLE public.orders OWNER TO postgres;

--
-- Name: orders_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.orders_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.orders_id_seq OWNER TO postgres;

--
-- Name: orders_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.orders_id_seq OWNED BY public.orders.id;


--
-- Name: personal_access_tokens; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.personal_access_tokens (
    id bigint NOT NULL,
    tokenable_type character varying(255) NOT NULL,
    tokenable_id bigint NOT NULL,
    name text NOT NULL,
    token character varying(64) NOT NULL,
    abilities text,
    last_used_at timestamp(0) without time zone,
    expires_at timestamp(0) without time zone,
    created_at timestamp(0) without time zone,
    updated_at timestamp(0) without time zone
);


ALTER TABLE public.personal_access_tokens OWNER TO postgres;

--
-- Name: personal_access_tokens_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.personal_access_tokens_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.personal_access_tokens_id_seq OWNER TO postgres;

--
-- Name: personal_access_tokens_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.personal_access_tokens_id_seq OWNED BY public.personal_access_tokens.id;


--
-- Name: products; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.products (
    id bigint NOT NULL,
    category_id bigint NOT NULL,
    name character varying(255) NOT NULL,
    slug character varying(255) NOT NULL,
    description text,
    price numeric(10,2) NOT NULL,
    stock integer DEFAULT 0 NOT NULL,
    sku character varying(255),
    status boolean DEFAULT true NOT NULL,
    created_at timestamp(0) without time zone,
    updated_at timestamp(0) without time zone,
    deleted_at timestamp(0) without time zone,
    image character varying(255)
);


ALTER TABLE public.products OWNER TO postgres;

--
-- Name: products_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.products_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.products_id_seq OWNER TO postgres;

--
-- Name: products_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.products_id_seq OWNED BY public.products.id;


--
-- Name: sessions; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.sessions (
    id character varying(255) NOT NULL,
    user_id bigint,
    ip_address character varying(45),
    user_agent text,
    payload text NOT NULL,
    last_activity integer NOT NULL
);


ALTER TABLE public.sessions OWNER TO postgres;

--
-- Name: users; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.users (
    id bigint NOT NULL,
    name character varying(255) NOT NULL,
    email character varying(255) NOT NULL,
    email_verified_at timestamp(0) without time zone,
    password character varying(255),
    avatar character varying(255),
    remember_token character varying(100),
    is_admin boolean DEFAULT false NOT NULL,
    created_at timestamp(0) without time zone,
    updated_at timestamp(0) without time zone,
    role character varying(255) DEFAULT 'user'::character varying NOT NULL,
    phone character varying(255),
    picture character varying(255),
    address text,
    google_id character varying(255)
);


ALTER TABLE public.users OWNER TO postgres;

--
-- Name: users_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.users_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.users_id_seq OWNER TO postgres;

--
-- Name: users_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.users_id_seq OWNED BY public.users.id;


--
-- Name: categories id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.categories ALTER COLUMN id SET DEFAULT nextval('public.categories_id_seq'::regclass);


--
-- Name: failed_jobs id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.failed_jobs ALTER COLUMN id SET DEFAULT nextval('public.failed_jobs_id_seq'::regclass);


--
-- Name: jobs id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.jobs ALTER COLUMN id SET DEFAULT nextval('public.jobs_id_seq'::regclass);


--
-- Name: migrations id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.migrations ALTER COLUMN id SET DEFAULT nextval('public.migrations_id_seq'::regclass);


--
-- Name: order_items id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.order_items ALTER COLUMN id SET DEFAULT nextval('public.order_items_id_seq'::regclass);


--
-- Name: orders id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.orders ALTER COLUMN id SET DEFAULT nextval('public.orders_id_seq'::regclass);


--
-- Name: personal_access_tokens id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.personal_access_tokens ALTER COLUMN id SET DEFAULT nextval('public.personal_access_tokens_id_seq'::regclass);


--
-- Name: products id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.products ALTER COLUMN id SET DEFAULT nextval('public.products_id_seq'::regclass);


--
-- Name: users id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users ALTER COLUMN id SET DEFAULT nextval('public.users_id_seq'::regclass);


--
-- Data for Name: cache; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.cache (key, value, expiration) FROM stdin;
laravel_cache_admin@example.com|127.0.0.1:timer	i:1763044204;	1763044204
laravel_cache_admin@example.com|127.0.0.1	i:2;	1763044204
laravel_cache_zmart@example.com|127.0.0.1:timer	i:1772645346;	1772645346
laravel_cache_zmart@example.com|127.0.0.1	i:1;	1772645346
\.


--
-- Data for Name: cache_locks; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.cache_locks (key, owner, expiration) FROM stdin;
\.


--
-- Data for Name: categories; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.categories (id, name, slug, description, image, color, status, created_at, updated_at) FROM stdin;
10	Clothes	clothes	xd	categories/3Ichh1Efw6ggfCYWp2rIwtAAaoC2YzcIjS0oj6Ok.jpg	#a01c1c	t	2025-11-11 10:57:22	2025-11-11 10:57:22
3	Home & Kitchen	home-kitchen	\N	categories/BDPPt7NgOJx008gCh3W5ggIDH1SuxSMII4Od912h.jpg	#10b981	t	2025-10-29 13:53:43	2025-11-11 11:09:45
12	House	house	xd	categories/6pFdGaumGTzs04Ppe3Axf5llp8nlWrGrWpOgjGxx.jpg	#0033ff	t	2025-11-13 14:38:51	2025-11-13 14:38:51
13	Usings	usings	userzin	categories/dtOk0WvRr8RvocGTBecLU6BuCi5l2jMiVu2ABQMl.jpg	#e00000	t	2025-11-13 14:39:20	2025-11-13 14:39:20
11	PC Parts	pc-parts	lmao	categories/YMhLmiCOOM4mCcYuwqS8T7fK8MEt05SZJUI2dqkZ.jpg	#dc0909	t	2025-11-11 11:06:30	2025-11-13 14:39:34
\.


--
-- Data for Name: failed_jobs; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.failed_jobs (id, uuid, connection, queue, payload, exception, failed_at) FROM stdin;
1	45502c5e-dbd7-4f66-8ddb-6d0981d646c5	database	default	{"uuid":"45502c5e-dbd7-4f66-8ddb-6d0981d646c5","displayName":"App\\\\Mail\\\\WelcomeEmail","job":"Illuminate\\\\Queue\\\\CallQueuedHandler@call","maxTries":null,"maxExceptions":null,"failOnTimeout":false,"backoff":null,"timeout":null,"retryUntil":null,"data":{"commandName":"Illuminate\\\\Mail\\\\SendQueuedMailable","command":"O:34:\\"Illuminate\\\\Mail\\\\SendQueuedMailable\\":15:{s:8:\\"mailable\\";O:21:\\"App\\\\Mail\\\\WelcomeEmail\\":3:{s:4:\\"user\\";O:45:\\"Illuminate\\\\Contracts\\\\Database\\\\ModelIdentifier\\":5:{s:5:\\"class\\";s:15:\\"App\\\\Models\\\\User\\";s:2:\\"id\\";i:5;s:9:\\"relations\\";a:0:{}s:10:\\"connection\\";s:5:\\"pgsql\\";s:15:\\"collectionClass\\";N;}s:2:\\"to\\";a:1:{i:0;a:2:{s:4:\\"name\\";N;s:7:\\"address\\";s:24:\\"smart.gaming86@gmail.com\\";}}s:6:\\"mailer\\";s:4:\\"smtp\\";}s:5:\\"tries\\";N;s:7:\\"timeout\\";N;s:13:\\"maxExceptions\\";N;s:17:\\"shouldBeEncrypted\\";b:0;s:10:\\"connection\\";N;s:5:\\"queue\\";N;s:5:\\"delay\\";N;s:11:\\"afterCommit\\";N;s:10:\\"middleware\\";a:0:{}s:7:\\"chained\\";a:0:{}s:15:\\"chainConnection\\";N;s:10:\\"chainQueue\\";N;s:19:\\"chainCatchCallbacks\\";N;s:3:\\"job\\";N;}"},"createdAt":1772645644,"delay":null}	Symfony\\Component\\Mailer\\Exception\\UnexpectedResponseException: Expected response code "354" but got code "550", with message "550 5.7.0 Too many emails per second. Please upgrade your plan https://mailtrap.io/billing/plans/testing". in C:\\Users\\DELL\\primeshop\\PRIME-SHOP\\vendor\\symfony\\mailer\\Transport\\Smtp\\SmtpTransport.php:342\nStack trace:\n#0 C:\\Users\\DELL\\primeshop\\PRIME-SHOP\\vendor\\symfony\\mailer\\Transport\\Smtp\\SmtpTransport.php(198): Symfony\\Component\\Mailer\\Transport\\Smtp\\SmtpTransport->assertResponseCode('550 5.7.0 Too m...', Array)\n#1 C:\\Users\\DELL\\primeshop\\PRIME-SHOP\\vendor\\symfony\\mailer\\Transport\\Smtp\\EsmtpTransport.php(150): Symfony\\Component\\Mailer\\Transport\\Smtp\\SmtpTransport->executeCommand('DATA\\r\\n', Array)\n#2 C:\\Users\\DELL\\primeshop\\PRIME-SHOP\\vendor\\symfony\\mailer\\Transport\\Smtp\\SmtpTransport.php(220): Symfony\\Component\\Mailer\\Transport\\Smtp\\EsmtpTransport->executeCommand('DATA\\r\\n', Array)\n#3 C:\\Users\\DELL\\primeshop\\PRIME-SHOP\\vendor\\symfony\\mailer\\Transport\\AbstractTransport.php(69): Symfony\\Component\\Mailer\\Transport\\Smtp\\SmtpTransport->doSend(Object(Symfony\\Component\\Mailer\\SentMessage))\n#4 C:\\Users\\DELL\\primeshop\\PRIME-SHOP\\vendor\\symfony\\mailer\\Transport\\Smtp\\SmtpTransport.php(138): Symfony\\Component\\Mailer\\Transport\\AbstractTransport->send(Object(Symfony\\Component\\Mime\\Email), Object(Symfony\\Component\\Mailer\\DelayedEnvelope))\n#5 C:\\Users\\DELL\\primeshop\\PRIME-SHOP\\vendor\\laravel\\framework\\src\\Illuminate\\Mail\\Mailer.php(584): Symfony\\Component\\Mailer\\Transport\\Smtp\\SmtpTransport->send(Object(Symfony\\Component\\Mime\\Email), Object(Symfony\\Component\\Mailer\\DelayedEnvelope))\n#6 C:\\Users\\DELL\\primeshop\\PRIME-SHOP\\vendor\\laravel\\framework\\src\\Illuminate\\Mail\\Mailer.php(331): Illuminate\\Mail\\Mailer->sendSymfonyMessage(Object(Symfony\\Component\\Mime\\Email))\n#7 C:\\Users\\DELL\\primeshop\\PRIME-SHOP\\vendor\\laravel\\framework\\src\\Illuminate\\Mail\\Mailable.php(207): Illuminate\\Mail\\Mailer->send('emails.welcome', Array, Object(Closure))\n#8 C:\\Users\\DELL\\primeshop\\PRIME-SHOP\\vendor\\laravel\\framework\\src\\Illuminate\\Support\\Traits\\Localizable.php(19): Illuminate\\Mail\\Mailable->Illuminate\\Mail\\{closure}()\n#9 C:\\Users\\DELL\\primeshop\\PRIME-SHOP\\vendor\\laravel\\framework\\src\\Illuminate\\Mail\\Mailable.php(200): Illuminate\\Mail\\Mailable->withLocale(NULL, Object(Closure))\n#10 C:\\Users\\DELL\\primeshop\\PRIME-SHOP\\vendor\\laravel\\framework\\src\\Illuminate\\Mail\\SendQueuedMailable.php(82): Illuminate\\Mail\\Mailable->send(Object(Illuminate\\Mail\\MailManager))\n#11 C:\\Users\\DELL\\primeshop\\PRIME-SHOP\\vendor\\laravel\\framework\\src\\Illuminate\\Container\\BoundMethod.php(36): Illuminate\\Mail\\SendQueuedMailable->handle(Object(Illuminate\\Mail\\MailManager))\n#12 C:\\Users\\DELL\\primeshop\\PRIME-SHOP\\vendor\\laravel\\framework\\src\\Illuminate\\Container\\Util.php(43): Illuminate\\Container\\BoundMethod::Illuminate\\Container\\{closure}()\n#13 C:\\Users\\DELL\\primeshop\\PRIME-SHOP\\vendor\\laravel\\framework\\src\\Illuminate\\Container\\BoundMethod.php(96): Illuminate\\Container\\Util::unwrapIfClosure(Object(Closure))\n#14 C:\\Users\\DELL\\primeshop\\PRIME-SHOP\\vendor\\laravel\\framework\\src\\Illuminate\\Container\\BoundMethod.php(35): Illuminate\\Container\\BoundMethod::callBoundMethod(Object(Illuminate\\Foundation\\Application), Array, Object(Closure))\n#15 C:\\Users\\DELL\\primeshop\\PRIME-SHOP\\vendor\\laravel\\framework\\src\\Illuminate\\Container\\Container.php(780): Illuminate\\Container\\BoundMethod::call(Object(Illuminate\\Foundation\\Application), Array, Array, NULL)\n#16 C:\\Users\\DELL\\primeshop\\PRIME-SHOP\\vendor\\laravel\\framework\\src\\Illuminate\\Bus\\Dispatcher.php(132): Illuminate\\Container\\Container->call(Array)\n#17 C:\\Users\\DELL\\primeshop\\PRIME-SHOP\\vendor\\laravel\\framework\\src\\Illuminate\\Pipeline\\Pipeline.php(169): Illuminate\\Bus\\Dispatcher->Illuminate\\Bus\\{closure}(Object(Illuminate\\Mail\\SendQueuedMailable))\n#18 C:\\Users\\DELL\\primeshop\\PRIME-SHOP\\vendor\\laravel\\framework\\src\\Illuminate\\Pipeline\\Pipeline.php(126): Illuminate\\Pipeline\\Pipeline->Illuminate\\Pipeline\\{closure}(Object(Illuminate\\Mail\\SendQueuedMailable))\n#19 C:\\Users\\DELL\\primeshop\\PRIME-SHOP\\vendor\\laravel\\framework\\src\\Illuminate\\Bus\\Dispatcher.php(136): Illuminate\\Pipeline\\Pipeline->then(Object(Closure))\n#20 C:\\Users\\DELL\\primeshop\\PRIME-SHOP\\vendor\\laravel\\framework\\src\\Illuminate\\Queue\\CallQueuedHandler.php(134): Illuminate\\Bus\\Dispatcher->dispatchNow(Object(Illuminate\\Mail\\SendQueuedMailable), false)\n#21 C:\\Users\\DELL\\primeshop\\PRIME-SHOP\\vendor\\laravel\\framework\\src\\Illuminate\\Pipeline\\Pipeline.php(169): Illuminate\\Queue\\CallQueuedHandler->Illuminate\\Queue\\{closure}(Object(Illuminate\\Mail\\SendQueuedMailable))\n#22 C:\\Users\\DELL\\primeshop\\PRIME-SHOP\\vendor\\laravel\\framework\\src\\Illuminate\\Pipeline\\Pipeline.php(126): Illuminate\\Pipeline\\Pipeline->Illuminate\\Pipeline\\{closure}(Object(Illuminate\\Mail\\SendQueuedMailable))\n#23 C:\\Users\\DELL\\primeshop\\PRIME-SHOP\\vendor\\laravel\\framework\\src\\Illuminate\\Queue\\CallQueuedHandler.php(127): Illuminate\\Pipeline\\Pipeline->then(Object(Closure))\n#24 C:\\Users\\DELL\\primeshop\\PRIME-SHOP\\vendor\\laravel\\framework\\src\\Illuminate\\Queue\\CallQueuedHandler.php(68): Illuminate\\Queue\\CallQueuedHandler->dispatchThroughMiddleware(Object(Illuminate\\Queue\\Jobs\\DatabaseJob), Object(Illuminate\\Mail\\SendQueuedMailable))\n#25 C:\\Users\\DELL\\primeshop\\PRIME-SHOP\\vendor\\laravel\\framework\\src\\Illuminate\\Queue\\Jobs\\Job.php(102): Illuminate\\Queue\\CallQueuedHandler->call(Object(Illuminate\\Queue\\Jobs\\DatabaseJob), Array)\n#26 C:\\Users\\DELL\\primeshop\\PRIME-SHOP\\vendor\\laravel\\framework\\src\\Illuminate\\Queue\\Worker.php(444): Illuminate\\Queue\\Jobs\\Job->fire()\n#27 C:\\Users\\DELL\\primeshop\\PRIME-SHOP\\vendor\\laravel\\framework\\src\\Illuminate\\Queue\\Worker.php(394): Illuminate\\Queue\\Worker->process('database', Object(Illuminate\\Queue\\Jobs\\DatabaseJob), Object(Illuminate\\Queue\\WorkerOptions))\n#28 C:\\Users\\DELL\\primeshop\\PRIME-SHOP\\vendor\\laravel\\framework\\src\\Illuminate\\Queue\\Worker.php(180): Illuminate\\Queue\\Worker->runJob(Object(Illuminate\\Queue\\Jobs\\DatabaseJob), 'database', Object(Illuminate\\Queue\\WorkerOptions))\n#29 C:\\Users\\DELL\\primeshop\\PRIME-SHOP\\vendor\\laravel\\framework\\src\\Illuminate\\Queue\\Console\\WorkCommand.php(148): Illuminate\\Queue\\Worker->daemon('database', 'default', Object(Illuminate\\Queue\\WorkerOptions))\n#30 C:\\Users\\DELL\\primeshop\\PRIME-SHOP\\vendor\\laravel\\framework\\src\\Illuminate\\Queue\\Console\\WorkCommand.php(131): Illuminate\\Queue\\Console\\WorkCommand->runWorker('database', 'default')\n#31 C:\\Users\\DELL\\primeshop\\PRIME-SHOP\\vendor\\laravel\\framework\\src\\Illuminate\\Container\\BoundMethod.php(36): Illuminate\\Queue\\Console\\WorkCommand->handle()\n#32 C:\\Users\\DELL\\primeshop\\PRIME-SHOP\\vendor\\laravel\\framework\\src\\Illuminate\\Container\\Util.php(43): Illuminate\\Container\\BoundMethod::Illuminate\\Container\\{closure}()\n#33 C:\\Users\\DELL\\primeshop\\PRIME-SHOP\\vendor\\laravel\\framework\\src\\Illuminate\\Container\\BoundMethod.php(96): Illuminate\\Container\\Util::unwrapIfClosure(Object(Closure))\n#34 C:\\Users\\DELL\\primeshop\\PRIME-SHOP\\vendor\\laravel\\framework\\src\\Illuminate\\Container\\BoundMethod.php(35): Illuminate\\Container\\BoundMethod::callBoundMethod(Object(Illuminate\\Foundation\\Application), Array, Object(Closure))\n#35 C:\\Users\\DELL\\primeshop\\PRIME-SHOP\\vendor\\laravel\\framework\\src\\Illuminate\\Container\\Container.php(780): Illuminate\\Container\\BoundMethod::call(Object(Illuminate\\Foundation\\Application), Array, Array, NULL)\n#36 C:\\Users\\DELL\\primeshop\\PRIME-SHOP\\vendor\\laravel\\framework\\src\\Illuminate\\Console\\Command.php(211): Illuminate\\Container\\Container->call(Array)\n#37 C:\\Users\\DELL\\primeshop\\PRIME-SHOP\\vendor\\symfony\\console\\Command\\Command.php(318): Illuminate\\Console\\Command->execute(Object(Symfony\\Component\\Console\\Input\\ArgvInput), Object(Illuminate\\Console\\OutputStyle))\n#38 C:\\Users\\DELL\\primeshop\\PRIME-SHOP\\vendor\\laravel\\framework\\src\\Illuminate\\Console\\Command.php(180): Symfony\\Component\\Console\\Command\\Command->run(Object(Symfony\\Component\\Console\\Input\\ArgvInput), Object(Illuminate\\Console\\OutputStyle))\n#39 C:\\Users\\DELL\\primeshop\\PRIME-SHOP\\vendor\\symfony\\console\\Application.php(1092): Illuminate\\Console\\Command->run(Object(Symfony\\Component\\Console\\Input\\ArgvInput), Object(Symfony\\Component\\Console\\Output\\ConsoleOutput))\n#40 C:\\Users\\DELL\\primeshop\\PRIME-SHOP\\vendor\\symfony\\console\\Application.php(341): Symfony\\Component\\Console\\Application->doRunCommand(Object(Illuminate\\Queue\\Console\\WorkCommand), Object(Symfony\\Component\\Console\\Input\\ArgvInput), Object(Symfony\\Component\\Console\\Output\\ConsoleOutput))\n#41 C:\\Users\\DELL\\primeshop\\PRIME-SHOP\\vendor\\symfony\\console\\Application.php(192): Symfony\\Component\\Console\\Application->doRun(Object(Symfony\\Component\\Console\\Input\\ArgvInput), Object(Symfony\\Component\\Console\\Output\\ConsoleOutput))\n#42 C:\\Users\\DELL\\primeshop\\PRIME-SHOP\\vendor\\laravel\\framework\\src\\Illuminate\\Foundation\\Console\\Kernel.php(197): Symfony\\Component\\Console\\Application->run(Object(Symfony\\Component\\Console\\Input\\ArgvInput), Object(Symfony\\Component\\Console\\Output\\ConsoleOutput))\n#43 C:\\Users\\DELL\\primeshop\\PRIME-SHOP\\vendor\\laravel\\framework\\src\\Illuminate\\Foundation\\Application.php(1234): Illuminate\\Foundation\\Console\\Kernel->handle(Object(Symfony\\Component\\Console\\Input\\ArgvInput), Object(Symfony\\Component\\Console\\Output\\ConsoleOutput))\n#44 C:\\Users\\DELL\\primeshop\\PRIME-SHOP\\artisan(16): Illuminate\\Foundation\\Application->handleCommand(Object(Symfony\\Component\\Console\\Input\\ArgvInput))\n#45 {main}	2026-03-05 15:24:16
2	2e0620a0-ea1c-4aac-88bd-0105a3a1f991	database	default	{"uuid":"2e0620a0-ea1c-4aac-88bd-0105a3a1f991","displayName":"App\\\\Mail\\\\OrderConfirmationMail","job":"Illuminate\\\\Queue\\\\CallQueuedHandler@call","maxTries":null,"maxExceptions":null,"failOnTimeout":false,"backoff":null,"timeout":null,"retryUntil":null,"data":{"commandName":"Illuminate\\\\Mail\\\\SendQueuedMailable","command":"O:34:\\"Illuminate\\\\Mail\\\\SendQueuedMailable\\":15:{s:8:\\"mailable\\";O:30:\\"App\\\\Mail\\\\OrderConfirmationMail\\":3:{s:5:\\"order\\";O:45:\\"Illuminate\\\\Contracts\\\\Database\\\\ModelIdentifier\\":5:{s:5:\\"class\\";s:16:\\"App\\\\Models\\\\Order\\";s:2:\\"id\\";i:21;s:9:\\"relations\\";a:3:{i:0;s:4:\\"user\\";i:1;s:5:\\"items\\";i:2;s:13:\\"items.product\\";}s:10:\\"connection\\";s:5:\\"pgsql\\";s:15:\\"collectionClass\\";N;}s:2:\\"to\\";a:1:{i:0;a:2:{s:4:\\"name\\";N;s:7:\\"address\\";s:35:\\"ahmed.amokrane@univ-constantine2.dz\\";}}s:6:\\"mailer\\";s:4:\\"smtp\\";}s:5:\\"tries\\";N;s:7:\\"timeout\\";N;s:13:\\"maxExceptions\\";N;s:17:\\"shouldBeEncrypted\\";b:0;s:10:\\"connection\\";N;s:5:\\"queue\\";N;s:5:\\"delay\\";N;s:11:\\"afterCommit\\";N;s:10:\\"middleware\\";a:0:{}s:7:\\"chained\\";a:0:{}s:15:\\"chainConnection\\";N;s:10:\\"chainQueue\\";N;s:19:\\"chainCatchCallbacks\\";N;s:3:\\"job\\";N;}"},"createdAt":1772816753,"delay":null}	Error: Class "Barryvdh\\DomPDF\\Facade\\Pdf" not found in C:\\Users\\DELL\\primeshop\\PRIME-SHOP\\app\\Mail\\OrderConfirmationMail.php:42\nStack trace:\n#0 C:\\Users\\DELL\\primeshop\\PRIME-SHOP\\vendor\\laravel\\framework\\src\\Illuminate\\Mail\\Mailable.php(1810): App\\Mail\\OrderConfirmationMail->attachments()\n#1 C:\\Users\\DELL\\primeshop\\PRIME-SHOP\\vendor\\laravel\\framework\\src\\Illuminate\\Mail\\Mailable.php(1690): Illuminate\\Mail\\Mailable->ensureAttachmentsAreHydrated()\n#2 C:\\Users\\DELL\\primeshop\\PRIME-SHOP\\vendor\\laravel\\framework\\src\\Illuminate\\Mail\\Mailable.php(201): Illuminate\\Mail\\Mailable->prepareMailableForDelivery()\n#3 C:\\Users\\DELL\\primeshop\\PRIME-SHOP\\vendor\\laravel\\framework\\src\\Illuminate\\Support\\Traits\\Localizable.php(19): Illuminate\\Mail\\Mailable->Illuminate\\Mail\\{closure}()\n#4 C:\\Users\\DELL\\primeshop\\PRIME-SHOP\\vendor\\laravel\\framework\\src\\Illuminate\\Mail\\Mailable.php(200): Illuminate\\Mail\\Mailable->withLocale(NULL, Object(Closure))\n#5 C:\\Users\\DELL\\primeshop\\PRIME-SHOP\\vendor\\laravel\\framework\\src\\Illuminate\\Mail\\SendQueuedMailable.php(82): Illuminate\\Mail\\Mailable->send(Object(Illuminate\\Mail\\MailManager))\n#6 C:\\Users\\DELL\\primeshop\\PRIME-SHOP\\vendor\\laravel\\framework\\src\\Illuminate\\Container\\BoundMethod.php(36): Illuminate\\Mail\\SendQueuedMailable->handle(Object(Illuminate\\Mail\\MailManager))\n#7 C:\\Users\\DELL\\primeshop\\PRIME-SHOP\\vendor\\laravel\\framework\\src\\Illuminate\\Container\\Util.php(43): Illuminate\\Container\\BoundMethod::Illuminate\\Container\\{closure}()\n#8 C:\\Users\\DELL\\primeshop\\PRIME-SHOP\\vendor\\laravel\\framework\\src\\Illuminate\\Container\\BoundMethod.php(96): Illuminate\\Container\\Util::unwrapIfClosure(Object(Closure))\n#9 C:\\Users\\DELL\\primeshop\\PRIME-SHOP\\vendor\\laravel\\framework\\src\\Illuminate\\Container\\BoundMethod.php(35): Illuminate\\Container\\BoundMethod::callBoundMethod(Object(Illuminate\\Foundation\\Application), Array, Object(Closure))\n#10 C:\\Users\\DELL\\primeshop\\PRIME-SHOP\\vendor\\laravel\\framework\\src\\Illuminate\\Container\\Container.php(780): Illuminate\\Container\\BoundMethod::call(Object(Illuminate\\Foundation\\Application), Array, Array, NULL)\n#11 C:\\Users\\DELL\\primeshop\\PRIME-SHOP\\vendor\\laravel\\framework\\src\\Illuminate\\Bus\\Dispatcher.php(132): Illuminate\\Container\\Container->call(Array)\n#12 C:\\Users\\DELL\\primeshop\\PRIME-SHOP\\vendor\\laravel\\framework\\src\\Illuminate\\Pipeline\\Pipeline.php(169): Illuminate\\Bus\\Dispatcher->Illuminate\\Bus\\{closure}(Object(Illuminate\\Mail\\SendQueuedMailable))\n#13 C:\\Users\\DELL\\primeshop\\PRIME-SHOP\\vendor\\laravel\\framework\\src\\Illuminate\\Pipeline\\Pipeline.php(126): Illuminate\\Pipeline\\Pipeline->Illuminate\\Pipeline\\{closure}(Object(Illuminate\\Mail\\SendQueuedMailable))\n#14 C:\\Users\\DELL\\primeshop\\PRIME-SHOP\\vendor\\laravel\\framework\\src\\Illuminate\\Bus\\Dispatcher.php(136): Illuminate\\Pipeline\\Pipeline->then(Object(Closure))\n#15 C:\\Users\\DELL\\primeshop\\PRIME-SHOP\\vendor\\laravel\\framework\\src\\Illuminate\\Queue\\CallQueuedHandler.php(134): Illuminate\\Bus\\Dispatcher->dispatchNow(Object(Illuminate\\Mail\\SendQueuedMailable), false)\n#16 C:\\Users\\DELL\\primeshop\\PRIME-SHOP\\vendor\\laravel\\framework\\src\\Illuminate\\Pipeline\\Pipeline.php(169): Illuminate\\Queue\\CallQueuedHandler->Illuminate\\Queue\\{closure}(Object(Illuminate\\Mail\\SendQueuedMailable))\n#17 C:\\Users\\DELL\\primeshop\\PRIME-SHOP\\vendor\\laravel\\framework\\src\\Illuminate\\Pipeline\\Pipeline.php(126): Illuminate\\Pipeline\\Pipeline->Illuminate\\Pipeline\\{closure}(Object(Illuminate\\Mail\\SendQueuedMailable))\n#18 C:\\Users\\DELL\\primeshop\\PRIME-SHOP\\vendor\\laravel\\framework\\src\\Illuminate\\Queue\\CallQueuedHandler.php(127): Illuminate\\Pipeline\\Pipeline->then(Object(Closure))\n#19 C:\\Users\\DELL\\primeshop\\PRIME-SHOP\\vendor\\laravel\\framework\\src\\Illuminate\\Queue\\CallQueuedHandler.php(68): Illuminate\\Queue\\CallQueuedHandler->dispatchThroughMiddleware(Object(Illuminate\\Queue\\Jobs\\DatabaseJob), Object(Illuminate\\Mail\\SendQueuedMailable))\n#20 C:\\Users\\DELL\\primeshop\\PRIME-SHOP\\vendor\\laravel\\framework\\src\\Illuminate\\Queue\\Jobs\\Job.php(102): Illuminate\\Queue\\CallQueuedHandler->call(Object(Illuminate\\Queue\\Jobs\\DatabaseJob), Array)\n#21 C:\\Users\\DELL\\primeshop\\PRIME-SHOP\\vendor\\laravel\\framework\\src\\Illuminate\\Queue\\Worker.php(444): Illuminate\\Queue\\Jobs\\Job->fire()\n#22 C:\\Users\\DELL\\primeshop\\PRIME-SHOP\\vendor\\laravel\\framework\\src\\Illuminate\\Queue\\Worker.php(394): Illuminate\\Queue\\Worker->process('database', Object(Illuminate\\Queue\\Jobs\\DatabaseJob), Object(Illuminate\\Queue\\WorkerOptions))\n#23 C:\\Users\\DELL\\primeshop\\PRIME-SHOP\\vendor\\laravel\\framework\\src\\Illuminate\\Queue\\Worker.php(180): Illuminate\\Queue\\Worker->runJob(Object(Illuminate\\Queue\\Jobs\\DatabaseJob), 'database', Object(Illuminate\\Queue\\WorkerOptions))\n#24 C:\\Users\\DELL\\primeshop\\PRIME-SHOP\\vendor\\laravel\\framework\\src\\Illuminate\\Queue\\Console\\WorkCommand.php(148): Illuminate\\Queue\\Worker->daemon('database', 'default', Object(Illuminate\\Queue\\WorkerOptions))\n#25 C:\\Users\\DELL\\primeshop\\PRIME-SHOP\\vendor\\laravel\\framework\\src\\Illuminate\\Queue\\Console\\WorkCommand.php(131): Illuminate\\Queue\\Console\\WorkCommand->runWorker('database', 'default')\n#26 C:\\Users\\DELL\\primeshop\\PRIME-SHOP\\vendor\\laravel\\framework\\src\\Illuminate\\Container\\BoundMethod.php(36): Illuminate\\Queue\\Console\\WorkCommand->handle()\n#27 C:\\Users\\DELL\\primeshop\\PRIME-SHOP\\vendor\\laravel\\framework\\src\\Illuminate\\Container\\Util.php(43): Illuminate\\Container\\BoundMethod::Illuminate\\Container\\{closure}()\n#28 C:\\Users\\DELL\\primeshop\\PRIME-SHOP\\vendor\\laravel\\framework\\src\\Illuminate\\Container\\BoundMethod.php(96): Illuminate\\Container\\Util::unwrapIfClosure(Object(Closure))\n#29 C:\\Users\\DELL\\primeshop\\PRIME-SHOP\\vendor\\laravel\\framework\\src\\Illuminate\\Container\\BoundMethod.php(35): Illuminate\\Container\\BoundMethod::callBoundMethod(Object(Illuminate\\Foundation\\Application), Array, Object(Closure))\n#30 C:\\Users\\DELL\\primeshop\\PRIME-SHOP\\vendor\\laravel\\framework\\src\\Illuminate\\Container\\Container.php(780): Illuminate\\Container\\BoundMethod::call(Object(Illuminate\\Foundation\\Application), Array, Array, NULL)\n#31 C:\\Users\\DELL\\primeshop\\PRIME-SHOP\\vendor\\laravel\\framework\\src\\Illuminate\\Console\\Command.php(211): Illuminate\\Container\\Container->call(Array)\n#32 C:\\Users\\DELL\\primeshop\\PRIME-SHOP\\vendor\\symfony\\console\\Command\\Command.php(318): Illuminate\\Console\\Command->execute(Object(Symfony\\Component\\Console\\Input\\ArgvInput), Object(Illuminate\\Console\\OutputStyle))\n#33 C:\\Users\\DELL\\primeshop\\PRIME-SHOP\\vendor\\laravel\\framework\\src\\Illuminate\\Console\\Command.php(180): Symfony\\Component\\Console\\Command\\Command->run(Object(Symfony\\Component\\Console\\Input\\ArgvInput), Object(Illuminate\\Console\\OutputStyle))\n#34 C:\\Users\\DELL\\primeshop\\PRIME-SHOP\\vendor\\symfony\\console\\Application.php(1092): Illuminate\\Console\\Command->run(Object(Symfony\\Component\\Console\\Input\\ArgvInput), Object(Symfony\\Component\\Console\\Output\\ConsoleOutput))\n#35 C:\\Users\\DELL\\primeshop\\PRIME-SHOP\\vendor\\symfony\\console\\Application.php(341): Symfony\\Component\\Console\\Application->doRunCommand(Object(Illuminate\\Queue\\Console\\WorkCommand), Object(Symfony\\Component\\Console\\Input\\ArgvInput), Object(Symfony\\Component\\Console\\Output\\ConsoleOutput))\n#36 C:\\Users\\DELL\\primeshop\\PRIME-SHOP\\vendor\\symfony\\console\\Application.php(192): Symfony\\Component\\Console\\Application->doRun(Object(Symfony\\Component\\Console\\Input\\ArgvInput), Object(Symfony\\Component\\Console\\Output\\ConsoleOutput))\n#37 C:\\Users\\DELL\\primeshop\\PRIME-SHOP\\vendor\\laravel\\framework\\src\\Illuminate\\Foundation\\Console\\Kernel.php(197): Symfony\\Component\\Console\\Application->run(Object(Symfony\\Component\\Console\\Input\\ArgvInput), Object(Symfony\\Component\\Console\\Output\\ConsoleOutput))\n#38 C:\\Users\\DELL\\primeshop\\PRIME-SHOP\\vendor\\laravel\\framework\\src\\Illuminate\\Foundation\\Application.php(1234): Illuminate\\Foundation\\Console\\Kernel->handle(Object(Symfony\\Component\\Console\\Input\\ArgvInput), Object(Symfony\\Component\\Console\\Output\\ConsoleOutput))\n#39 C:\\Users\\DELL\\primeshop\\PRIME-SHOP\\artisan(16): Illuminate\\Foundation\\Application->handleCommand(Object(Symfony\\Component\\Console\\Input\\ArgvInput))\n#40 {main}	2026-03-06 17:05:53
3	e99d1114-34fa-4872-8e0c-b5e4e591ad87	database	default	{"uuid":"e99d1114-34fa-4872-8e0c-b5e4e591ad87","displayName":"App\\\\Mail\\\\OrderConfirmationMail","job":"Illuminate\\\\Queue\\\\CallQueuedHandler@call","maxTries":null,"maxExceptions":null,"failOnTimeout":false,"backoff":null,"timeout":null,"retryUntil":null,"data":{"commandName":"Illuminate\\\\Mail\\\\SendQueuedMailable","command":"O:34:\\"Illuminate\\\\Mail\\\\SendQueuedMailable\\":15:{s:8:\\"mailable\\";O:30:\\"App\\\\Mail\\\\OrderConfirmationMail\\":3:{s:5:\\"order\\";O:45:\\"Illuminate\\\\Contracts\\\\Database\\\\ModelIdentifier\\":5:{s:5:\\"class\\";s:16:\\"App\\\\Models\\\\Order\\";s:2:\\"id\\";i:22;s:9:\\"relations\\";a:3:{i:0;s:4:\\"user\\";i:1;s:5:\\"items\\";i:2;s:13:\\"items.product\\";}s:10:\\"connection\\";s:5:\\"pgsql\\";s:15:\\"collectionClass\\";N;}s:2:\\"to\\";a:1:{i:0;a:2:{s:4:\\"name\\";N;s:7:\\"address\\";s:35:\\"ahmed.amokrane@univ-constantine2.dz\\";}}s:6:\\"mailer\\";s:4:\\"smtp\\";}s:5:\\"tries\\";N;s:7:\\"timeout\\";N;s:13:\\"maxExceptions\\";N;s:17:\\"shouldBeEncrypted\\";b:0;s:10:\\"connection\\";N;s:5:\\"queue\\";N;s:5:\\"delay\\";N;s:11:\\"afterCommit\\";N;s:10:\\"middleware\\";a:0:{}s:7:\\"chained\\";a:0:{}s:15:\\"chainConnection\\";N;s:10:\\"chainQueue\\";N;s:19:\\"chainCatchCallbacks\\";N;s:3:\\"job\\";N;}"},"createdAt":1772817080,"delay":null}	Error: Class "Barryvdh\\DomPDF\\Facade\\Pdf" not found in C:\\Users\\DELL\\primeshop\\PRIME-SHOP\\app\\Mail\\OrderConfirmationMail.php:42\nStack trace:\n#0 C:\\Users\\DELL\\primeshop\\PRIME-SHOP\\vendor\\laravel\\framework\\src\\Illuminate\\Mail\\Mailable.php(1810): App\\Mail\\OrderConfirmationMail->attachments()\n#1 C:\\Users\\DELL\\primeshop\\PRIME-SHOP\\vendor\\laravel\\framework\\src\\Illuminate\\Mail\\Mailable.php(1690): Illuminate\\Mail\\Mailable->ensureAttachmentsAreHydrated()\n#2 C:\\Users\\DELL\\primeshop\\PRIME-SHOP\\vendor\\laravel\\framework\\src\\Illuminate\\Mail\\Mailable.php(201): Illuminate\\Mail\\Mailable->prepareMailableForDelivery()\n#3 C:\\Users\\DELL\\primeshop\\PRIME-SHOP\\vendor\\laravel\\framework\\src\\Illuminate\\Support\\Traits\\Localizable.php(19): Illuminate\\Mail\\Mailable->Illuminate\\Mail\\{closure}()\n#4 C:\\Users\\DELL\\primeshop\\PRIME-SHOP\\vendor\\laravel\\framework\\src\\Illuminate\\Mail\\Mailable.php(200): Illuminate\\Mail\\Mailable->withLocale(NULL, Object(Closure))\n#5 C:\\Users\\DELL\\primeshop\\PRIME-SHOP\\vendor\\laravel\\framework\\src\\Illuminate\\Mail\\SendQueuedMailable.php(82): Illuminate\\Mail\\Mailable->send(Object(Illuminate\\Mail\\MailManager))\n#6 C:\\Users\\DELL\\primeshop\\PRIME-SHOP\\vendor\\laravel\\framework\\src\\Illuminate\\Container\\BoundMethod.php(36): Illuminate\\Mail\\SendQueuedMailable->handle(Object(Illuminate\\Mail\\MailManager))\n#7 C:\\Users\\DELL\\primeshop\\PRIME-SHOP\\vendor\\laravel\\framework\\src\\Illuminate\\Container\\Util.php(43): Illuminate\\Container\\BoundMethod::Illuminate\\Container\\{closure}()\n#8 C:\\Users\\DELL\\primeshop\\PRIME-SHOP\\vendor\\laravel\\framework\\src\\Illuminate\\Container\\BoundMethod.php(96): Illuminate\\Container\\Util::unwrapIfClosure(Object(Closure))\n#9 C:\\Users\\DELL\\primeshop\\PRIME-SHOP\\vendor\\laravel\\framework\\src\\Illuminate\\Container\\BoundMethod.php(35): Illuminate\\Container\\BoundMethod::callBoundMethod(Object(Illuminate\\Foundation\\Application), Array, Object(Closure))\n#10 C:\\Users\\DELL\\primeshop\\PRIME-SHOP\\vendor\\laravel\\framework\\src\\Illuminate\\Container\\Container.php(780): Illuminate\\Container\\BoundMethod::call(Object(Illuminate\\Foundation\\Application), Array, Array, NULL)\n#11 C:\\Users\\DELL\\primeshop\\PRIME-SHOP\\vendor\\laravel\\framework\\src\\Illuminate\\Bus\\Dispatcher.php(132): Illuminate\\Container\\Container->call(Array)\n#12 C:\\Users\\DELL\\primeshop\\PRIME-SHOP\\vendor\\laravel\\framework\\src\\Illuminate\\Pipeline\\Pipeline.php(169): Illuminate\\Bus\\Dispatcher->Illuminate\\Bus\\{closure}(Object(Illuminate\\Mail\\SendQueuedMailable))\n#13 C:\\Users\\DELL\\primeshop\\PRIME-SHOP\\vendor\\laravel\\framework\\src\\Illuminate\\Pipeline\\Pipeline.php(126): Illuminate\\Pipeline\\Pipeline->Illuminate\\Pipeline\\{closure}(Object(Illuminate\\Mail\\SendQueuedMailable))\n#14 C:\\Users\\DELL\\primeshop\\PRIME-SHOP\\vendor\\laravel\\framework\\src\\Illuminate\\Bus\\Dispatcher.php(136): Illuminate\\Pipeline\\Pipeline->then(Object(Closure))\n#15 C:\\Users\\DELL\\primeshop\\PRIME-SHOP\\vendor\\laravel\\framework\\src\\Illuminate\\Queue\\CallQueuedHandler.php(134): Illuminate\\Bus\\Dispatcher->dispatchNow(Object(Illuminate\\Mail\\SendQueuedMailable), false)\n#16 C:\\Users\\DELL\\primeshop\\PRIME-SHOP\\vendor\\laravel\\framework\\src\\Illuminate\\Pipeline\\Pipeline.php(169): Illuminate\\Queue\\CallQueuedHandler->Illuminate\\Queue\\{closure}(Object(Illuminate\\Mail\\SendQueuedMailable))\n#17 C:\\Users\\DELL\\primeshop\\PRIME-SHOP\\vendor\\laravel\\framework\\src\\Illuminate\\Pipeline\\Pipeline.php(126): Illuminate\\Pipeline\\Pipeline->Illuminate\\Pipeline\\{closure}(Object(Illuminate\\Mail\\SendQueuedMailable))\n#18 C:\\Users\\DELL\\primeshop\\PRIME-SHOP\\vendor\\laravel\\framework\\src\\Illuminate\\Queue\\CallQueuedHandler.php(127): Illuminate\\Pipeline\\Pipeline->then(Object(Closure))\n#19 C:\\Users\\DELL\\primeshop\\PRIME-SHOP\\vendor\\laravel\\framework\\src\\Illuminate\\Queue\\CallQueuedHandler.php(68): Illuminate\\Queue\\CallQueuedHandler->dispatchThroughMiddleware(Object(Illuminate\\Queue\\Jobs\\DatabaseJob), Object(Illuminate\\Mail\\SendQueuedMailable))\n#20 C:\\Users\\DELL\\primeshop\\PRIME-SHOP\\vendor\\laravel\\framework\\src\\Illuminate\\Queue\\Jobs\\Job.php(102): Illuminate\\Queue\\CallQueuedHandler->call(Object(Illuminate\\Queue\\Jobs\\DatabaseJob), Array)\n#21 C:\\Users\\DELL\\primeshop\\PRIME-SHOP\\vendor\\laravel\\framework\\src\\Illuminate\\Queue\\Worker.php(444): Illuminate\\Queue\\Jobs\\Job->fire()\n#22 C:\\Users\\DELL\\primeshop\\PRIME-SHOP\\vendor\\laravel\\framework\\src\\Illuminate\\Queue\\Worker.php(394): Illuminate\\Queue\\Worker->process('database', Object(Illuminate\\Queue\\Jobs\\DatabaseJob), Object(Illuminate\\Queue\\WorkerOptions))\n#23 C:\\Users\\DELL\\primeshop\\PRIME-SHOP\\vendor\\laravel\\framework\\src\\Illuminate\\Queue\\Worker.php(180): Illuminate\\Queue\\Worker->runJob(Object(Illuminate\\Queue\\Jobs\\DatabaseJob), 'database', Object(Illuminate\\Queue\\WorkerOptions))\n#24 C:\\Users\\DELL\\primeshop\\PRIME-SHOP\\vendor\\laravel\\framework\\src\\Illuminate\\Queue\\Console\\WorkCommand.php(148): Illuminate\\Queue\\Worker->daemon('database', 'default', Object(Illuminate\\Queue\\WorkerOptions))\n#25 C:\\Users\\DELL\\primeshop\\PRIME-SHOP\\vendor\\laravel\\framework\\src\\Illuminate\\Queue\\Console\\WorkCommand.php(131): Illuminate\\Queue\\Console\\WorkCommand->runWorker('database', 'default')\n#26 C:\\Users\\DELL\\primeshop\\PRIME-SHOP\\vendor\\laravel\\framework\\src\\Illuminate\\Container\\BoundMethod.php(36): Illuminate\\Queue\\Console\\WorkCommand->handle()\n#27 C:\\Users\\DELL\\primeshop\\PRIME-SHOP\\vendor\\laravel\\framework\\src\\Illuminate\\Container\\Util.php(43): Illuminate\\Container\\BoundMethod::Illuminate\\Container\\{closure}()\n#28 C:\\Users\\DELL\\primeshop\\PRIME-SHOP\\vendor\\laravel\\framework\\src\\Illuminate\\Container\\BoundMethod.php(96): Illuminate\\Container\\Util::unwrapIfClosure(Object(Closure))\n#29 C:\\Users\\DELL\\primeshop\\PRIME-SHOP\\vendor\\laravel\\framework\\src\\Illuminate\\Container\\BoundMethod.php(35): Illuminate\\Container\\BoundMethod::callBoundMethod(Object(Illuminate\\Foundation\\Application), Array, Object(Closure))\n#30 C:\\Users\\DELL\\primeshop\\PRIME-SHOP\\vendor\\laravel\\framework\\src\\Illuminate\\Container\\Container.php(780): Illuminate\\Container\\BoundMethod::call(Object(Illuminate\\Foundation\\Application), Array, Array, NULL)\n#31 C:\\Users\\DELL\\primeshop\\PRIME-SHOP\\vendor\\laravel\\framework\\src\\Illuminate\\Console\\Command.php(211): Illuminate\\Container\\Container->call(Array)\n#32 C:\\Users\\DELL\\primeshop\\PRIME-SHOP\\vendor\\symfony\\console\\Command\\Command.php(318): Illuminate\\Console\\Command->execute(Object(Symfony\\Component\\Console\\Input\\ArgvInput), Object(Illuminate\\Console\\OutputStyle))\n#33 C:\\Users\\DELL\\primeshop\\PRIME-SHOP\\vendor\\laravel\\framework\\src\\Illuminate\\Console\\Command.php(180): Symfony\\Component\\Console\\Command\\Command->run(Object(Symfony\\Component\\Console\\Input\\ArgvInput), Object(Illuminate\\Console\\OutputStyle))\n#34 C:\\Users\\DELL\\primeshop\\PRIME-SHOP\\vendor\\symfony\\console\\Application.php(1092): Illuminate\\Console\\Command->run(Object(Symfony\\Component\\Console\\Input\\ArgvInput), Object(Symfony\\Component\\Console\\Output\\ConsoleOutput))\n#35 C:\\Users\\DELL\\primeshop\\PRIME-SHOP\\vendor\\symfony\\console\\Application.php(341): Symfony\\Component\\Console\\Application->doRunCommand(Object(Illuminate\\Queue\\Console\\WorkCommand), Object(Symfony\\Component\\Console\\Input\\ArgvInput), Object(Symfony\\Component\\Console\\Output\\ConsoleOutput))\n#36 C:\\Users\\DELL\\primeshop\\PRIME-SHOP\\vendor\\symfony\\console\\Application.php(192): Symfony\\Component\\Console\\Application->doRun(Object(Symfony\\Component\\Console\\Input\\ArgvInput), Object(Symfony\\Component\\Console\\Output\\ConsoleOutput))\n#37 C:\\Users\\DELL\\primeshop\\PRIME-SHOP\\vendor\\laravel\\framework\\src\\Illuminate\\Foundation\\Console\\Kernel.php(197): Symfony\\Component\\Console\\Application->run(Object(Symfony\\Component\\Console\\Input\\ArgvInput), Object(Symfony\\Component\\Console\\Output\\ConsoleOutput))\n#38 C:\\Users\\DELL\\primeshop\\PRIME-SHOP\\vendor\\laravel\\framework\\src\\Illuminate\\Foundation\\Application.php(1234): Illuminate\\Foundation\\Console\\Kernel->handle(Object(Symfony\\Component\\Console\\Input\\ArgvInput), Object(Symfony\\Component\\Console\\Output\\ConsoleOutput))\n#39 C:\\Users\\DELL\\primeshop\\PRIME-SHOP\\artisan(16): Illuminate\\Foundation\\Application->handleCommand(Object(Symfony\\Component\\Console\\Input\\ArgvInput))\n#40 {main}	2026-03-06 17:11:22
4	5b059658-6931-432e-b226-c5861819ed33	database	default	{"uuid":"5b059658-6931-432e-b226-c5861819ed33","displayName":"App\\\\Mail\\\\OrderConfirmationMail","job":"Illuminate\\\\Queue\\\\CallQueuedHandler@call","maxTries":null,"maxExceptions":null,"failOnTimeout":false,"backoff":null,"timeout":null,"retryUntil":null,"data":{"commandName":"Illuminate\\\\Mail\\\\SendQueuedMailable","command":"O:34:\\"Illuminate\\\\Mail\\\\SendQueuedMailable\\":15:{s:8:\\"mailable\\";O:30:\\"App\\\\Mail\\\\OrderConfirmationMail\\":3:{s:5:\\"order\\";O:45:\\"Illuminate\\\\Contracts\\\\Database\\\\ModelIdentifier\\":5:{s:5:\\"class\\";s:16:\\"App\\\\Models\\\\Order\\";s:2:\\"id\\";i:23;s:9:\\"relations\\";a:3:{i:0;s:4:\\"user\\";i:1;s:5:\\"items\\";i:2;s:13:\\"items.product\\";}s:10:\\"connection\\";s:5:\\"pgsql\\";s:15:\\"collectionClass\\";N;}s:2:\\"to\\";a:1:{i:0;a:2:{s:4:\\"name\\";N;s:7:\\"address\\";s:35:\\"ahmed.amokrane@univ-constantine2.dz\\";}}s:6:\\"mailer\\";s:4:\\"smtp\\";}s:5:\\"tries\\";N;s:7:\\"timeout\\";N;s:13:\\"maxExceptions\\";N;s:17:\\"shouldBeEncrypted\\";b:0;s:10:\\"connection\\";N;s:5:\\"queue\\";N;s:5:\\"delay\\";N;s:11:\\"afterCommit\\";N;s:10:\\"middleware\\";a:0:{}s:7:\\"chained\\";a:0:{}s:15:\\"chainConnection\\";N;s:10:\\"chainQueue\\";N;s:19:\\"chainCatchCallbacks\\";N;s:3:\\"job\\";N;}"},"createdAt":1772817252,"delay":null}	Error: Class "Barryvdh\\DomPDF\\Facade\\Pdf" not found in C:\\Users\\DELL\\primeshop\\PRIME-SHOP\\app\\Mail\\OrderConfirmationMail.php:42\nStack trace:\n#0 C:\\Users\\DELL\\primeshop\\PRIME-SHOP\\vendor\\laravel\\framework\\src\\Illuminate\\Mail\\Mailable.php(1810): App\\Mail\\OrderConfirmationMail->attachments()\n#1 C:\\Users\\DELL\\primeshop\\PRIME-SHOP\\vendor\\laravel\\framework\\src\\Illuminate\\Mail\\Mailable.php(1690): Illuminate\\Mail\\Mailable->ensureAttachmentsAreHydrated()\n#2 C:\\Users\\DELL\\primeshop\\PRIME-SHOP\\vendor\\laravel\\framework\\src\\Illuminate\\Mail\\Mailable.php(201): Illuminate\\Mail\\Mailable->prepareMailableForDelivery()\n#3 C:\\Users\\DELL\\primeshop\\PRIME-SHOP\\vendor\\laravel\\framework\\src\\Illuminate\\Support\\Traits\\Localizable.php(19): Illuminate\\Mail\\Mailable->Illuminate\\Mail\\{closure}()\n#4 C:\\Users\\DELL\\primeshop\\PRIME-SHOP\\vendor\\laravel\\framework\\src\\Illuminate\\Mail\\Mailable.php(200): Illuminate\\Mail\\Mailable->withLocale(NULL, Object(Closure))\n#5 C:\\Users\\DELL\\primeshop\\PRIME-SHOP\\vendor\\laravel\\framework\\src\\Illuminate\\Mail\\SendQueuedMailable.php(82): Illuminate\\Mail\\Mailable->send(Object(Illuminate\\Mail\\MailManager))\n#6 C:\\Users\\DELL\\primeshop\\PRIME-SHOP\\vendor\\laravel\\framework\\src\\Illuminate\\Container\\BoundMethod.php(36): Illuminate\\Mail\\SendQueuedMailable->handle(Object(Illuminate\\Mail\\MailManager))\n#7 C:\\Users\\DELL\\primeshop\\PRIME-SHOP\\vendor\\laravel\\framework\\src\\Illuminate\\Container\\Util.php(43): Illuminate\\Container\\BoundMethod::Illuminate\\Container\\{closure}()\n#8 C:\\Users\\DELL\\primeshop\\PRIME-SHOP\\vendor\\laravel\\framework\\src\\Illuminate\\Container\\BoundMethod.php(96): Illuminate\\Container\\Util::unwrapIfClosure(Object(Closure))\n#9 C:\\Users\\DELL\\primeshop\\PRIME-SHOP\\vendor\\laravel\\framework\\src\\Illuminate\\Container\\BoundMethod.php(35): Illuminate\\Container\\BoundMethod::callBoundMethod(Object(Illuminate\\Foundation\\Application), Array, Object(Closure))\n#10 C:\\Users\\DELL\\primeshop\\PRIME-SHOP\\vendor\\laravel\\framework\\src\\Illuminate\\Container\\Container.php(780): Illuminate\\Container\\BoundMethod::call(Object(Illuminate\\Foundation\\Application), Array, Array, NULL)\n#11 C:\\Users\\DELL\\primeshop\\PRIME-SHOP\\vendor\\laravel\\framework\\src\\Illuminate\\Bus\\Dispatcher.php(132): Illuminate\\Container\\Container->call(Array)\n#12 C:\\Users\\DELL\\primeshop\\PRIME-SHOP\\vendor\\laravel\\framework\\src\\Illuminate\\Pipeline\\Pipeline.php(169): Illuminate\\Bus\\Dispatcher->Illuminate\\Bus\\{closure}(Object(Illuminate\\Mail\\SendQueuedMailable))\n#13 C:\\Users\\DELL\\primeshop\\PRIME-SHOP\\vendor\\laravel\\framework\\src\\Illuminate\\Pipeline\\Pipeline.php(126): Illuminate\\Pipeline\\Pipeline->Illuminate\\Pipeline\\{closure}(Object(Illuminate\\Mail\\SendQueuedMailable))\n#14 C:\\Users\\DELL\\primeshop\\PRIME-SHOP\\vendor\\laravel\\framework\\src\\Illuminate\\Bus\\Dispatcher.php(136): Illuminate\\Pipeline\\Pipeline->then(Object(Closure))\n#15 C:\\Users\\DELL\\primeshop\\PRIME-SHOP\\vendor\\laravel\\framework\\src\\Illuminate\\Queue\\CallQueuedHandler.php(134): Illuminate\\Bus\\Dispatcher->dispatchNow(Object(Illuminate\\Mail\\SendQueuedMailable), false)\n#16 C:\\Users\\DELL\\primeshop\\PRIME-SHOP\\vendor\\laravel\\framework\\src\\Illuminate\\Pipeline\\Pipeline.php(169): Illuminate\\Queue\\CallQueuedHandler->Illuminate\\Queue\\{closure}(Object(Illuminate\\Mail\\SendQueuedMailable))\n#17 C:\\Users\\DELL\\primeshop\\PRIME-SHOP\\vendor\\laravel\\framework\\src\\Illuminate\\Pipeline\\Pipeline.php(126): Illuminate\\Pipeline\\Pipeline->Illuminate\\Pipeline\\{closure}(Object(Illuminate\\Mail\\SendQueuedMailable))\n#18 C:\\Users\\DELL\\primeshop\\PRIME-SHOP\\vendor\\laravel\\framework\\src\\Illuminate\\Queue\\CallQueuedHandler.php(127): Illuminate\\Pipeline\\Pipeline->then(Object(Closure))\n#19 C:\\Users\\DELL\\primeshop\\PRIME-SHOP\\vendor\\laravel\\framework\\src\\Illuminate\\Queue\\CallQueuedHandler.php(68): Illuminate\\Queue\\CallQueuedHandler->dispatchThroughMiddleware(Object(Illuminate\\Queue\\Jobs\\DatabaseJob), Object(Illuminate\\Mail\\SendQueuedMailable))\n#20 C:\\Users\\DELL\\primeshop\\PRIME-SHOP\\vendor\\laravel\\framework\\src\\Illuminate\\Queue\\Jobs\\Job.php(102): Illuminate\\Queue\\CallQueuedHandler->call(Object(Illuminate\\Queue\\Jobs\\DatabaseJob), Array)\n#21 C:\\Users\\DELL\\primeshop\\PRIME-SHOP\\vendor\\laravel\\framework\\src\\Illuminate\\Queue\\Worker.php(444): Illuminate\\Queue\\Jobs\\Job->fire()\n#22 C:\\Users\\DELL\\primeshop\\PRIME-SHOP\\vendor\\laravel\\framework\\src\\Illuminate\\Queue\\Worker.php(394): Illuminate\\Queue\\Worker->process('database', Object(Illuminate\\Queue\\Jobs\\DatabaseJob), Object(Illuminate\\Queue\\WorkerOptions))\n#23 C:\\Users\\DELL\\primeshop\\PRIME-SHOP\\vendor\\laravel\\framework\\src\\Illuminate\\Queue\\Worker.php(180): Illuminate\\Queue\\Worker->runJob(Object(Illuminate\\Queue\\Jobs\\DatabaseJob), 'database', Object(Illuminate\\Queue\\WorkerOptions))\n#24 C:\\Users\\DELL\\primeshop\\PRIME-SHOP\\vendor\\laravel\\framework\\src\\Illuminate\\Queue\\Console\\WorkCommand.php(148): Illuminate\\Queue\\Worker->daemon('database', 'default', Object(Illuminate\\Queue\\WorkerOptions))\n#25 C:\\Users\\DELL\\primeshop\\PRIME-SHOP\\vendor\\laravel\\framework\\src\\Illuminate\\Queue\\Console\\WorkCommand.php(131): Illuminate\\Queue\\Console\\WorkCommand->runWorker('database', 'default')\n#26 C:\\Users\\DELL\\primeshop\\PRIME-SHOP\\vendor\\laravel\\framework\\src\\Illuminate\\Container\\BoundMethod.php(36): Illuminate\\Queue\\Console\\WorkCommand->handle()\n#27 C:\\Users\\DELL\\primeshop\\PRIME-SHOP\\vendor\\laravel\\framework\\src\\Illuminate\\Container\\Util.php(43): Illuminate\\Container\\BoundMethod::Illuminate\\Container\\{closure}()\n#28 C:\\Users\\DELL\\primeshop\\PRIME-SHOP\\vendor\\laravel\\framework\\src\\Illuminate\\Container\\BoundMethod.php(96): Illuminate\\Container\\Util::unwrapIfClosure(Object(Closure))\n#29 C:\\Users\\DELL\\primeshop\\PRIME-SHOP\\vendor\\laravel\\framework\\src\\Illuminate\\Container\\BoundMethod.php(35): Illuminate\\Container\\BoundMethod::callBoundMethod(Object(Illuminate\\Foundation\\Application), Array, Object(Closure))\n#30 C:\\Users\\DELL\\primeshop\\PRIME-SHOP\\vendor\\laravel\\framework\\src\\Illuminate\\Container\\Container.php(780): Illuminate\\Container\\BoundMethod::call(Object(Illuminate\\Foundation\\Application), Array, Array, NULL)\n#31 C:\\Users\\DELL\\primeshop\\PRIME-SHOP\\vendor\\laravel\\framework\\src\\Illuminate\\Console\\Command.php(211): Illuminate\\Container\\Container->call(Array)\n#32 C:\\Users\\DELL\\primeshop\\PRIME-SHOP\\vendor\\symfony\\console\\Command\\Command.php(318): Illuminate\\Console\\Command->execute(Object(Symfony\\Component\\Console\\Input\\ArgvInput), Object(Illuminate\\Console\\OutputStyle))\n#33 C:\\Users\\DELL\\primeshop\\PRIME-SHOP\\vendor\\laravel\\framework\\src\\Illuminate\\Console\\Command.php(180): Symfony\\Component\\Console\\Command\\Command->run(Object(Symfony\\Component\\Console\\Input\\ArgvInput), Object(Illuminate\\Console\\OutputStyle))\n#34 C:\\Users\\DELL\\primeshop\\PRIME-SHOP\\vendor\\symfony\\console\\Application.php(1092): Illuminate\\Console\\Command->run(Object(Symfony\\Component\\Console\\Input\\ArgvInput), Object(Symfony\\Component\\Console\\Output\\ConsoleOutput))\n#35 C:\\Users\\DELL\\primeshop\\PRIME-SHOP\\vendor\\symfony\\console\\Application.php(341): Symfony\\Component\\Console\\Application->doRunCommand(Object(Illuminate\\Queue\\Console\\WorkCommand), Object(Symfony\\Component\\Console\\Input\\ArgvInput), Object(Symfony\\Component\\Console\\Output\\ConsoleOutput))\n#36 C:\\Users\\DELL\\primeshop\\PRIME-SHOP\\vendor\\symfony\\console\\Application.php(192): Symfony\\Component\\Console\\Application->doRun(Object(Symfony\\Component\\Console\\Input\\ArgvInput), Object(Symfony\\Component\\Console\\Output\\ConsoleOutput))\n#37 C:\\Users\\DELL\\primeshop\\PRIME-SHOP\\vendor\\laravel\\framework\\src\\Illuminate\\Foundation\\Console\\Kernel.php(197): Symfony\\Component\\Console\\Application->run(Object(Symfony\\Component\\Console\\Input\\ArgvInput), Object(Symfony\\Component\\Console\\Output\\ConsoleOutput))\n#38 C:\\Users\\DELL\\primeshop\\PRIME-SHOP\\vendor\\laravel\\framework\\src\\Illuminate\\Foundation\\Application.php(1234): Illuminate\\Foundation\\Console\\Kernel->handle(Object(Symfony\\Component\\Console\\Input\\ArgvInput), Object(Symfony\\Component\\Console\\Output\\ConsoleOutput))\n#39 C:\\Users\\DELL\\primeshop\\PRIME-SHOP\\artisan(16): Illuminate\\Foundation\\Application->handleCommand(Object(Symfony\\Component\\Console\\Input\\ArgvInput))\n#40 {main}	2026-03-06 17:14:13
5	982b4f7d-965c-4105-b4c2-2df4493c8de6	database	default	{"uuid":"982b4f7d-965c-4105-b4c2-2df4493c8de6","displayName":"App\\\\Mail\\\\OrderConfirmationMail","job":"Illuminate\\\\Queue\\\\CallQueuedHandler@call","maxTries":null,"maxExceptions":null,"failOnTimeout":false,"backoff":null,"timeout":null,"retryUntil":null,"data":{"commandName":"Illuminate\\\\Mail\\\\SendQueuedMailable","command":"O:34:\\"Illuminate\\\\Mail\\\\SendQueuedMailable\\":15:{s:8:\\"mailable\\";O:30:\\"App\\\\Mail\\\\OrderConfirmationMail\\":3:{s:5:\\"order\\";O:45:\\"Illuminate\\\\Contracts\\\\Database\\\\ModelIdentifier\\":5:{s:5:\\"class\\";s:16:\\"App\\\\Models\\\\Order\\";s:2:\\"id\\";i:26;s:9:\\"relations\\";a:3:{i:0;s:4:\\"user\\";i:1;s:5:\\"items\\";i:2;s:13:\\"items.product\\";}s:10:\\"connection\\";s:5:\\"pgsql\\";s:15:\\"collectionClass\\";N;}s:2:\\"to\\";a:1:{i:0;a:2:{s:4:\\"name\\";N;s:7:\\"address\\";s:15:\\"hmada@email.com\\";}}s:6:\\"mailer\\";s:4:\\"smtp\\";}s:5:\\"tries\\";N;s:7:\\"timeout\\";N;s:13:\\"maxExceptions\\";N;s:17:\\"shouldBeEncrypted\\";b:0;s:10:\\"connection\\";N;s:5:\\"queue\\";N;s:5:\\"delay\\";N;s:11:\\"afterCommit\\";N;s:10:\\"middleware\\";a:0:{}s:7:\\"chained\\";a:0:{}s:15:\\"chainConnection\\";N;s:10:\\"chainQueue\\";N;s:19:\\"chainCatchCallbacks\\";N;s:3:\\"job\\";N;}"},"createdAt":1773161776,"delay":null}	ErrorException: Attempt to read property "name" on null in C:\\Users\\DELL\\primeshop\\PRIME-SHOP\\storage\\framework\\views\\9d606e6d2dba51b7f3f336aa7cbe7031.php:43\nStack trace:\n#0 C:\\Users\\DELL\\primeshop\\PRIME-SHOP\\vendor\\laravel\\framework\\src\\Illuminate\\Foundation\\Bootstrap\\HandleExceptions.php(256): Illuminate\\Foundation\\Bootstrap\\HandleExceptions->handleError(2, 'Attempt to read...', 'C:\\\\Users\\\\DELL\\\\p...', 43)\n#1 C:\\Users\\DELL\\primeshop\\PRIME-SHOP\\storage\\framework\\views\\9d606e6d2dba51b7f3f336aa7cbe7031.php(43): Illuminate\\Foundation\\Bootstrap\\HandleExceptions->Illuminate\\Foundation\\Bootstrap\\{closure}(2, 'Attempt to read...', 'C:\\\\Users\\\\DELL\\\\p...', 43)\n#2 C:\\Users\\DELL\\primeshop\\PRIME-SHOP\\vendor\\laravel\\framework\\src\\Illuminate\\Filesystem\\Filesystem.php(123): require('C:\\\\Users\\\\DELL\\\\p...')\n#3 C:\\Users\\DELL\\primeshop\\PRIME-SHOP\\vendor\\laravel\\framework\\src\\Illuminate\\Filesystem\\Filesystem.php(124): Illuminate\\Filesystem\\Filesystem::Illuminate\\Filesystem\\{closure}()\n#4 C:\\Users\\DELL\\primeshop\\PRIME-SHOP\\vendor\\laravel\\framework\\src\\Illuminate\\View\\Engines\\PhpEngine.php(57): Illuminate\\Filesystem\\Filesystem->getRequire('C:\\\\Users\\\\DELL\\\\p...', Array)\n#5 C:\\Users\\DELL\\primeshop\\PRIME-SHOP\\vendor\\laravel\\framework\\src\\Illuminate\\View\\Engines\\CompilerEngine.php(76): Illuminate\\View\\Engines\\PhpEngine->evaluatePath('C:\\\\Users\\\\DELL\\\\p...', Array)\n#6 C:\\Users\\DELL\\primeshop\\PRIME-SHOP\\vendor\\laravel\\framework\\src\\Illuminate\\View\\View.php(208): Illuminate\\View\\Engines\\CompilerEngine->get('C:\\\\Users\\\\DELL\\\\p...', Array)\n#7 C:\\Users\\DELL\\primeshop\\PRIME-SHOP\\vendor\\laravel\\framework\\src\\Illuminate\\View\\View.php(191): Illuminate\\View\\View->getContents()\n#8 C:\\Users\\DELL\\primeshop\\PRIME-SHOP\\vendor\\laravel\\framework\\src\\Illuminate\\View\\View.php(160): Illuminate\\View\\View->renderContents()\n#9 C:\\Users\\DELL\\primeshop\\PRIME-SHOP\\vendor\\barryvdh\\laravel-dompdf\\src\\PDF.php(142): Illuminate\\View\\View->render()\n#10 C:\\Users\\DELL\\primeshop\\PRIME-SHOP\\vendor\\barryvdh\\laravel-dompdf\\src\\Facade\\Pdf.php(66): Barryvdh\\DomPDF\\PDF->loadView('pdfs.invoice', Array)\n#11 C:\\Users\\DELL\\primeshop\\PRIME-SHOP\\app\\Mail\\OrderConfirmationMail.php(42): Barryvdh\\DomPDF\\Facade\\Pdf::__callStatic('loadView', Array)\n#12 C:\\Users\\DELL\\primeshop\\PRIME-SHOP\\vendor\\laravel\\framework\\src\\Illuminate\\Mail\\Mailable.php(1810): App\\Mail\\OrderConfirmationMail->attachments()\n#13 C:\\Users\\DELL\\primeshop\\PRIME-SHOP\\vendor\\laravel\\framework\\src\\Illuminate\\Mail\\Mailable.php(1690): Illuminate\\Mail\\Mailable->ensureAttachmentsAreHydrated()\n#14 C:\\Users\\DELL\\primeshop\\PRIME-SHOP\\vendor\\laravel\\framework\\src\\Illuminate\\Mail\\Mailable.php(201): Illuminate\\Mail\\Mailable->prepareMailableForDelivery()\n#15 C:\\Users\\DELL\\primeshop\\PRIME-SHOP\\vendor\\laravel\\framework\\src\\Illuminate\\Support\\Traits\\Localizable.php(19): Illuminate\\Mail\\Mailable->Illuminate\\Mail\\{closure}()\n#16 C:\\Users\\DELL\\primeshop\\PRIME-SHOP\\vendor\\laravel\\framework\\src\\Illuminate\\Mail\\Mailable.php(200): Illuminate\\Mail\\Mailable->withLocale(NULL, Object(Closure))\n#17 C:\\Users\\DELL\\primeshop\\PRIME-SHOP\\vendor\\laravel\\framework\\src\\Illuminate\\Mail\\SendQueuedMailable.php(82): Illuminate\\Mail\\Mailable->send(Object(Illuminate\\Mail\\MailManager))\n#18 C:\\Users\\DELL\\primeshop\\PRIME-SHOP\\vendor\\laravel\\framework\\src\\Illuminate\\Container\\BoundMethod.php(36): Illuminate\\Mail\\SendQueuedMailable->handle(Object(Illuminate\\Mail\\MailManager))\n#19 C:\\Users\\DELL\\primeshop\\PRIME-SHOP\\vendor\\laravel\\framework\\src\\Illuminate\\Container\\Util.php(43): Illuminate\\Container\\BoundMethod::Illuminate\\Container\\{closure}()\n#20 C:\\Users\\DELL\\primeshop\\PRIME-SHOP\\vendor\\laravel\\framework\\src\\Illuminate\\Container\\BoundMethod.php(96): Illuminate\\Container\\Util::unwrapIfClosure(Object(Closure))\n#21 C:\\Users\\DELL\\primeshop\\PRIME-SHOP\\vendor\\laravel\\framework\\src\\Illuminate\\Container\\BoundMethod.php(35): Illuminate\\Container\\BoundMethod::callBoundMethod(Object(Illuminate\\Foundation\\Application), Array, Object(Closure))\n#22 C:\\Users\\DELL\\primeshop\\PRIME-SHOP\\vendor\\laravel\\framework\\src\\Illuminate\\Container\\Container.php(780): Illuminate\\Container\\BoundMethod::call(Object(Illuminate\\Foundation\\Application), Array, Array, NULL)\n#23 C:\\Users\\DELL\\primeshop\\PRIME-SHOP\\vendor\\laravel\\framework\\src\\Illuminate\\Bus\\Dispatcher.php(132): Illuminate\\Container\\Container->call(Array)\n#24 C:\\Users\\DELL\\primeshop\\PRIME-SHOP\\vendor\\laravel\\framework\\src\\Illuminate\\Pipeline\\Pipeline.php(169): Illuminate\\Bus\\Dispatcher->Illuminate\\Bus\\{closure}(Object(Illuminate\\Mail\\SendQueuedMailable))\n#25 C:\\Users\\DELL\\primeshop\\PRIME-SHOP\\vendor\\laravel\\framework\\src\\Illuminate\\Pipeline\\Pipeline.php(126): Illuminate\\Pipeline\\Pipeline->Illuminate\\Pipeline\\{closure}(Object(Illuminate\\Mail\\SendQueuedMailable))\n#26 C:\\Users\\DELL\\primeshop\\PRIME-SHOP\\vendor\\laravel\\framework\\src\\Illuminate\\Bus\\Dispatcher.php(136): Illuminate\\Pipeline\\Pipeline->then(Object(Closure))\n#27 C:\\Users\\DELL\\primeshop\\PRIME-SHOP\\vendor\\laravel\\framework\\src\\Illuminate\\Queue\\CallQueuedHandler.php(134): Illuminate\\Bus\\Dispatcher->dispatchNow(Object(Illuminate\\Mail\\SendQueuedMailable), false)\n#28 C:\\Users\\DELL\\primeshop\\PRIME-SHOP\\vendor\\laravel\\framework\\src\\Illuminate\\Pipeline\\Pipeline.php(169): Illuminate\\Queue\\CallQueuedHandler->Illuminate\\Queue\\{closure}(Object(Illuminate\\Mail\\SendQueuedMailable))\n#29 C:\\Users\\DELL\\primeshop\\PRIME-SHOP\\vendor\\laravel\\framework\\src\\Illuminate\\Pipeline\\Pipeline.php(126): Illuminate\\Pipeline\\Pipeline->Illuminate\\Pipeline\\{closure}(Object(Illuminate\\Mail\\SendQueuedMailable))\n#30 C:\\Users\\DELL\\primeshop\\PRIME-SHOP\\vendor\\laravel\\framework\\src\\Illuminate\\Queue\\CallQueuedHandler.php(127): Illuminate\\Pipeline\\Pipeline->then(Object(Closure))\n#31 C:\\Users\\DELL\\primeshop\\PRIME-SHOP\\vendor\\laravel\\framework\\src\\Illuminate\\Queue\\CallQueuedHandler.php(68): Illuminate\\Queue\\CallQueuedHandler->dispatchThroughMiddleware(Object(Illuminate\\Queue\\Jobs\\DatabaseJob), Object(Illuminate\\Mail\\SendQueuedMailable))\n#32 C:\\Users\\DELL\\primeshop\\PRIME-SHOP\\vendor\\laravel\\framework\\src\\Illuminate\\Queue\\Jobs\\Job.php(102): Illuminate\\Queue\\CallQueuedHandler->call(Object(Illuminate\\Queue\\Jobs\\DatabaseJob), Array)\n#33 C:\\Users\\DELL\\primeshop\\PRIME-SHOP\\vendor\\laravel\\framework\\src\\Illuminate\\Queue\\Worker.php(444): Illuminate\\Queue\\Jobs\\Job->fire()\n#34 C:\\Users\\DELL\\primeshop\\PRIME-SHOP\\vendor\\laravel\\framework\\src\\Illuminate\\Queue\\Worker.php(394): Illuminate\\Queue\\Worker->process('database', Object(Illuminate\\Queue\\Jobs\\DatabaseJob), Object(Illuminate\\Queue\\WorkerOptions))\n#35 C:\\Users\\DELL\\primeshop\\PRIME-SHOP\\vendor\\laravel\\framework\\src\\Illuminate\\Queue\\Worker.php(180): Illuminate\\Queue\\Worker->runJob(Object(Illuminate\\Queue\\Jobs\\DatabaseJob), 'database', Object(Illuminate\\Queue\\WorkerOptions))\n#36 C:\\Users\\DELL\\primeshop\\PRIME-SHOP\\vendor\\laravel\\framework\\src\\Illuminate\\Queue\\Console\\WorkCommand.php(148): Illuminate\\Queue\\Worker->daemon('database', 'default', Object(Illuminate\\Queue\\WorkerOptions))\n#37 C:\\Users\\DELL\\primeshop\\PRIME-SHOP\\vendor\\laravel\\framework\\src\\Illuminate\\Queue\\Console\\WorkCommand.php(131): Illuminate\\Queue\\Console\\WorkCommand->runWorker('database', 'default')\n#38 C:\\Users\\DELL\\primeshop\\PRIME-SHOP\\vendor\\laravel\\framework\\src\\Illuminate\\Container\\BoundMethod.php(36): Illuminate\\Queue\\Console\\WorkCommand->handle()\n#39 C:\\Users\\DELL\\primeshop\\PRIME-SHOP\\vendor\\laravel\\framework\\src\\Illuminate\\Container\\Util.php(43): Illuminate\\Container\\BoundMethod::Illuminate\\Container\\{closure}()\n#40 C:\\Users\\DELL\\primeshop\\PRIME-SHOP\\vendor\\laravel\\framework\\src\\Illuminate\\Container\\BoundMethod.php(96): Illuminate\\Container\\Util::unwrapIfClosure(Object(Closure))\n#41 C:\\Users\\DELL\\primeshop\\PRIME-SHOP\\vendor\\laravel\\framework\\src\\Illuminate\\Container\\BoundMethod.php(35): Illuminate\\Container\\BoundMethod::callBoundMethod(Object(Illuminate\\Foundation\\Application), Array, Object(Closure))\n#42 C:\\Users\\DELL\\primeshop\\PRIME-SHOP\\vendor\\laravel\\framework\\src\\Illuminate\\Container\\Container.php(780): Illuminate\\Container\\BoundMethod::call(Object(Illuminate\\Foundation\\Application), Array, Array, NULL)\n#43 C:\\Users\\DELL\\primeshop\\PRIME-SHOP\\vendor\\laravel\\framework\\src\\Illuminate\\Console\\Command.php(211): Illuminate\\Container\\Container->call(Array)\n#44 C:\\Users\\DELL\\primeshop\\PRIME-SHOP\\vendor\\symfony\\console\\Command\\Command.php(318): Illuminate\\Console\\Command->execute(Object(Symfony\\Component\\Console\\Input\\ArgvInput), Object(Illuminate\\Console\\OutputStyle))\n#45 C:\\Users\\DELL\\primeshop\\PRIME-SHOP\\vendor\\laravel\\framework\\src\\Illuminate\\Console\\Command.php(180): Symfony\\Component\\Console\\Command\\Command->run(Object(Symfony\\Component\\Console\\Input\\ArgvInput), Object(Illuminate\\Console\\OutputStyle))\n#46 C:\\Users\\DELL\\primeshop\\PRIME-SHOP\\vendor\\symfony\\console\\Application.php(1092): Illuminate\\Console\\Command->run(Object(Symfony\\Component\\Console\\Input\\ArgvInput), Object(Symfony\\Component\\Console\\Output\\ConsoleOutput))\n#47 C:\\Users\\DELL\\primeshop\\PRIME-SHOP\\vendor\\symfony\\console\\Application.php(341): Symfony\\Component\\Console\\Application->doRunCommand(Object(Illuminate\\Queue\\Console\\WorkCommand), Object(Symfony\\Component\\Console\\Input\\ArgvInput), Object(Symfony\\Component\\Console\\Output\\ConsoleOutput))\n#48 C:\\Users\\DELL\\primeshop\\PRIME-SHOP\\vendor\\symfony\\console\\Application.php(192): Symfony\\Component\\Console\\Application->doRun(Object(Symfony\\Component\\Console\\Input\\ArgvInput), Object(Symfony\\Component\\Console\\Output\\ConsoleOutput))\n#49 C:\\Users\\DELL\\primeshop\\PRIME-SHOP\\vendor\\laravel\\framework\\src\\Illuminate\\Foundation\\Console\\Kernel.php(197): Symfony\\Component\\Console\\Application->run(Object(Symfony\\Component\\Console\\Input\\ArgvInput), Object(Symfony\\Component\\Console\\Output\\ConsoleOutput))\n#50 C:\\Users\\DELL\\primeshop\\PRIME-SHOP\\vendor\\laravel\\framework\\src\\Illuminate\\Foundation\\Application.php(1234): Illuminate\\Foundation\\Console\\Kernel->handle(Object(Symfony\\Component\\Console\\Input\\ArgvInput), Object(Symfony\\Component\\Console\\Output\\ConsoleOutput))\n#51 C:\\Users\\DELL\\primeshop\\PRIME-SHOP\\artisan(16): Illuminate\\Foundation\\Application->handleCommand(Object(Symfony\\Component\\Console\\Input\\ArgvInput))\n#52 {main}\n\nNext Illuminate\\View\\ViewException: Attempt to read property "name" on null (View: C:\\Users\\DELL\\primeshop\\PRIME-SHOP\\resources\\views\\pdfs\\invoice.blade.php) in C:\\Users\\DELL\\primeshop\\PRIME-SHOP\\storage\\framework\\views\\9d606e6d2dba51b7f3f336aa7cbe7031.php:43\nStack trace:\n#0 C:\\Users\\DELL\\primeshop\\PRIME-SHOP\\vendor\\laravel\\framework\\src\\Illuminate\\View\\Engines\\PhpEngine.php(59): Illuminate\\View\\Engines\\CompilerEngine->handleViewException(Object(ErrorException), 0)\n#1 C:\\Users\\DELL\\primeshop\\PRIME-SHOP\\vendor\\laravel\\framework\\src\\Illuminate\\View\\Engines\\CompilerEngine.php(76): Illuminate\\View\\Engines\\PhpEngine->evaluatePath('C:\\\\Users\\\\DELL\\\\p...', Array)\n#2 C:\\Users\\DELL\\primeshop\\PRIME-SHOP\\vendor\\laravel\\framework\\src\\Illuminate\\View\\View.php(208): Illuminate\\View\\Engines\\CompilerEngine->get('C:\\\\Users\\\\DELL\\\\p...', Array)\n#3 C:\\Users\\DELL\\primeshop\\PRIME-SHOP\\vendor\\laravel\\framework\\src\\Illuminate\\View\\View.php(191): Illuminate\\View\\View->getContents()\n#4 C:\\Users\\DELL\\primeshop\\PRIME-SHOP\\vendor\\laravel\\framework\\src\\Illuminate\\View\\View.php(160): Illuminate\\View\\View->renderContents()\n#5 C:\\Users\\DELL\\primeshop\\PRIME-SHOP\\vendor\\barryvdh\\laravel-dompdf\\src\\PDF.php(142): Illuminate\\View\\View->render()\n#6 C:\\Users\\DELL\\primeshop\\PRIME-SHOP\\vendor\\barryvdh\\laravel-dompdf\\src\\Facade\\Pdf.php(66): Barryvdh\\DomPDF\\PDF->loadView('pdfs.invoice', Array)\n#7 C:\\Users\\DELL\\primeshop\\PRIME-SHOP\\app\\Mail\\OrderConfirmationMail.php(42): Barryvdh\\DomPDF\\Facade\\Pdf::__callStatic('loadView', Array)\n#8 C:\\Users\\DELL\\primeshop\\PRIME-SHOP\\vendor\\laravel\\framework\\src\\Illuminate\\Mail\\Mailable.php(1810): App\\Mail\\OrderConfirmationMail->attachments()\n#9 C:\\Users\\DELL\\primeshop\\PRIME-SHOP\\vendor\\laravel\\framework\\src\\Illuminate\\Mail\\Mailable.php(1690): Illuminate\\Mail\\Mailable->ensureAttachmentsAreHydrated()\n#10 C:\\Users\\DELL\\primeshop\\PRIME-SHOP\\vendor\\laravel\\framework\\src\\Illuminate\\Mail\\Mailable.php(201): Illuminate\\Mail\\Mailable->prepareMailableForDelivery()\n#11 C:\\Users\\DELL\\primeshop\\PRIME-SHOP\\vendor\\laravel\\framework\\src\\Illuminate\\Support\\Traits\\Localizable.php(19): Illuminate\\Mail\\Mailable->Illuminate\\Mail\\{closure}()\n#12 C:\\Users\\DELL\\primeshop\\PRIME-SHOP\\vendor\\laravel\\framework\\src\\Illuminate\\Mail\\Mailable.php(200): Illuminate\\Mail\\Mailable->withLocale(NULL, Object(Closure))\n#13 C:\\Users\\DELL\\primeshop\\PRIME-SHOP\\vendor\\laravel\\framework\\src\\Illuminate\\Mail\\SendQueuedMailable.php(82): Illuminate\\Mail\\Mailable->send(Object(Illuminate\\Mail\\MailManager))\n#14 C:\\Users\\DELL\\primeshop\\PRIME-SHOP\\vendor\\laravel\\framework\\src\\Illuminate\\Container\\BoundMethod.php(36): Illuminate\\Mail\\SendQueuedMailable->handle(Object(Illuminate\\Mail\\MailManager))\n#15 C:\\Users\\DELL\\primeshop\\PRIME-SHOP\\vendor\\laravel\\framework\\src\\Illuminate\\Container\\Util.php(43): Illuminate\\Container\\BoundMethod::Illuminate\\Container\\{closure}()\n#16 C:\\Users\\DELL\\primeshop\\PRIME-SHOP\\vendor\\laravel\\framework\\src\\Illuminate\\Container\\BoundMethod.php(96): Illuminate\\Container\\Util::unwrapIfClosure(Object(Closure))\n#17 C:\\Users\\DELL\\primeshop\\PRIME-SHOP\\vendor\\laravel\\framework\\src\\Illuminate\\Container\\BoundMethod.php(35): Illuminate\\Container\\BoundMethod::callBoundMethod(Object(Illuminate\\Foundation\\Application), Array, Object(Closure))\n#18 C:\\Users\\DELL\\primeshop\\PRIME-SHOP\\vendor\\laravel\\framework\\src\\Illuminate\\Container\\Container.php(780): Illuminate\\Container\\BoundMethod::call(Object(Illuminate\\Foundation\\Application), Array, Array, NULL)\n#19 C:\\Users\\DELL\\primeshop\\PRIME-SHOP\\vendor\\laravel\\framework\\src\\Illuminate\\Bus\\Dispatcher.php(132): Illuminate\\Container\\Container->call(Array)\n#20 C:\\Users\\DELL\\primeshop\\PRIME-SHOP\\vendor\\laravel\\framework\\src\\Illuminate\\Pipeline\\Pipeline.php(169): Illuminate\\Bus\\Dispatcher->Illuminate\\Bus\\{closure}(Object(Illuminate\\Mail\\SendQueuedMailable))\n#21 C:\\Users\\DELL\\primeshop\\PRIME-SHOP\\vendor\\laravel\\framework\\src\\Illuminate\\Pipeline\\Pipeline.php(126): Illuminate\\Pipeline\\Pipeline->Illuminate\\Pipeline\\{closure}(Object(Illuminate\\Mail\\SendQueuedMailable))\n#22 C:\\Users\\DELL\\primeshop\\PRIME-SHOP\\vendor\\laravel\\framework\\src\\Illuminate\\Bus\\Dispatcher.php(136): Illuminate\\Pipeline\\Pipeline->then(Object(Closure))\n#23 C:\\Users\\DELL\\primeshop\\PRIME-SHOP\\vendor\\laravel\\framework\\src\\Illuminate\\Queue\\CallQueuedHandler.php(134): Illuminate\\Bus\\Dispatcher->dispatchNow(Object(Illuminate\\Mail\\SendQueuedMailable), false)\n#24 C:\\Users\\DELL\\primeshop\\PRIME-SHOP\\vendor\\laravel\\framework\\src\\Illuminate\\Pipeline\\Pipeline.php(169): Illuminate\\Queue\\CallQueuedHandler->Illuminate\\Queue\\{closure}(Object(Illuminate\\Mail\\SendQueuedMailable))\n#25 C:\\Users\\DELL\\primeshop\\PRIME-SHOP\\vendor\\laravel\\framework\\src\\Illuminate\\Pipeline\\Pipeline.php(126): Illuminate\\Pipeline\\Pipeline->Illuminate\\Pipeline\\{closure}(Object(Illuminate\\Mail\\SendQueuedMailable))\n#26 C:\\Users\\DELL\\primeshop\\PRIME-SHOP\\vendor\\laravel\\framework\\src\\Illuminate\\Queue\\CallQueuedHandler.php(127): Illuminate\\Pipeline\\Pipeline->then(Object(Closure))\n#27 C:\\Users\\DELL\\primeshop\\PRIME-SHOP\\vendor\\laravel\\framework\\src\\Illuminate\\Queue\\CallQueuedHandler.php(68): Illuminate\\Queue\\CallQueuedHandler->dispatchThroughMiddleware(Object(Illuminate\\Queue\\Jobs\\DatabaseJob), Object(Illuminate\\Mail\\SendQueuedMailable))\n#28 C:\\Users\\DELL\\primeshop\\PRIME-SHOP\\vendor\\laravel\\framework\\src\\Illuminate\\Queue\\Jobs\\Job.php(102): Illuminate\\Queue\\CallQueuedHandler->call(Object(Illuminate\\Queue\\Jobs\\DatabaseJob), Array)\n#29 C:\\Users\\DELL\\primeshop\\PRIME-SHOP\\vendor\\laravel\\framework\\src\\Illuminate\\Queue\\Worker.php(444): Illuminate\\Queue\\Jobs\\Job->fire()\n#30 C:\\Users\\DELL\\primeshop\\PRIME-SHOP\\vendor\\laravel\\framework\\src\\Illuminate\\Queue\\Worker.php(394): Illuminate\\Queue\\Worker->process('database', Object(Illuminate\\Queue\\Jobs\\DatabaseJob), Object(Illuminate\\Queue\\WorkerOptions))\n#31 C:\\Users\\DELL\\primeshop\\PRIME-SHOP\\vendor\\laravel\\framework\\src\\Illuminate\\Queue\\Worker.php(180): Illuminate\\Queue\\Worker->runJob(Object(Illuminate\\Queue\\Jobs\\DatabaseJob), 'database', Object(Illuminate\\Queue\\WorkerOptions))\n#32 C:\\Users\\DELL\\primeshop\\PRIME-SHOP\\vendor\\laravel\\framework\\src\\Illuminate\\Queue\\Console\\WorkCommand.php(148): Illuminate\\Queue\\Worker->daemon('database', 'default', Object(Illuminate\\Queue\\WorkerOptions))\n#33 C:\\Users\\DELL\\primeshop\\PRIME-SHOP\\vendor\\laravel\\framework\\src\\Illuminate\\Queue\\Console\\WorkCommand.php(131): Illuminate\\Queue\\Console\\WorkCommand->runWorker('database', 'default')\n#34 C:\\Users\\DELL\\primeshop\\PRIME-SHOP\\vendor\\laravel\\framework\\src\\Illuminate\\Container\\BoundMethod.php(36): Illuminate\\Queue\\Console\\WorkCommand->handle()\n#35 C:\\Users\\DELL\\primeshop\\PRIME-SHOP\\vendor\\laravel\\framework\\src\\Illuminate\\Container\\Util.php(43): Illuminate\\Container\\BoundMethod::Illuminate\\Container\\{closure}()\n#36 C:\\Users\\DELL\\primeshop\\PRIME-SHOP\\vendor\\laravel\\framework\\src\\Illuminate\\Container\\BoundMethod.php(96): Illuminate\\Container\\Util::unwrapIfClosure(Object(Closure))\n#37 C:\\Users\\DELL\\primeshop\\PRIME-SHOP\\vendor\\laravel\\framework\\src\\Illuminate\\Container\\BoundMethod.php(35): Illuminate\\Container\\BoundMethod::callBoundMethod(Object(Illuminate\\Foundation\\Application), Array, Object(Closure))\n#38 C:\\Users\\DELL\\primeshop\\PRIME-SHOP\\vendor\\laravel\\framework\\src\\Illuminate\\Container\\Container.php(780): Illuminate\\Container\\BoundMethod::call(Object(Illuminate\\Foundation\\Application), Array, Array, NULL)\n#39 C:\\Users\\DELL\\primeshop\\PRIME-SHOP\\vendor\\laravel\\framework\\src\\Illuminate\\Console\\Command.php(211): Illuminate\\Container\\Container->call(Array)\n#40 C:\\Users\\DELL\\primeshop\\PRIME-SHOP\\vendor\\symfony\\console\\Command\\Command.php(318): Illuminate\\Console\\Command->execute(Object(Symfony\\Component\\Console\\Input\\ArgvInput), Object(Illuminate\\Console\\OutputStyle))\n#41 C:\\Users\\DELL\\primeshop\\PRIME-SHOP\\vendor\\laravel\\framework\\src\\Illuminate\\Console\\Command.php(180): Symfony\\Component\\Console\\Command\\Command->run(Object(Symfony\\Component\\Console\\Input\\ArgvInput), Object(Illuminate\\Console\\OutputStyle))\n#42 C:\\Users\\DELL\\primeshop\\PRIME-SHOP\\vendor\\symfony\\console\\Application.php(1092): Illuminate\\Console\\Command->run(Object(Symfony\\Component\\Console\\Input\\ArgvInput), Object(Symfony\\Component\\Console\\Output\\ConsoleOutput))\n#43 C:\\Users\\DELL\\primeshop\\PRIME-SHOP\\vendor\\symfony\\console\\Application.php(341): Symfony\\Component\\Console\\Application->doRunCommand(Object(Illuminate\\Queue\\Console\\WorkCommand), Object(Symfony\\Component\\Console\\Input\\ArgvInput), Object(Symfony\\Component\\Console\\Output\\ConsoleOutput))\n#44 C:\\Users\\DELL\\primeshop\\PRIME-SHOP\\vendor\\symfony\\console\\Application.php(192): Symfony\\Component\\Console\\Application->doRun(Object(Symfony\\Component\\Console\\Input\\ArgvInput), Object(Symfony\\Component\\Console\\Output\\ConsoleOutput))\n#45 C:\\Users\\DELL\\primeshop\\PRIME-SHOP\\vendor\\laravel\\framework\\src\\Illuminate\\Foundation\\Console\\Kernel.php(197): Symfony\\Component\\Console\\Application->run(Object(Symfony\\Component\\Console\\Input\\ArgvInput), Object(Symfony\\Component\\Console\\Output\\ConsoleOutput))\n#46 C:\\Users\\DELL\\primeshop\\PRIME-SHOP\\vendor\\laravel\\framework\\src\\Illuminate\\Foundation\\Application.php(1234): Illuminate\\Foundation\\Console\\Kernel->handle(Object(Symfony\\Component\\Console\\Input\\ArgvInput), Object(Symfony\\Component\\Console\\Output\\ConsoleOutput))\n#47 C:\\Users\\DELL\\primeshop\\PRIME-SHOP\\artisan(16): Illuminate\\Foundation\\Application->handleCommand(Object(Symfony\\Component\\Console\\Input\\ArgvInput))\n#48 {main}	2026-03-10 16:56:19
6	d8fdfa51-5461-4ec8-bda6-ed9ff7914893	database	default	{"uuid":"d8fdfa51-5461-4ec8-bda6-ed9ff7914893","displayName":"App\\\\Mail\\\\OrderConfirmationMail","job":"Illuminate\\\\Queue\\\\CallQueuedHandler@call","maxTries":null,"maxExceptions":null,"failOnTimeout":false,"backoff":null,"timeout":null,"retryUntil":null,"data":{"commandName":"Illuminate\\\\Mail\\\\SendQueuedMailable","command":"O:34:\\"Illuminate\\\\Mail\\\\SendQueuedMailable\\":15:{s:8:\\"mailable\\";O:30:\\"App\\\\Mail\\\\OrderConfirmationMail\\":3:{s:5:\\"order\\";O:45:\\"Illuminate\\\\Contracts\\\\Database\\\\ModelIdentifier\\":5:{s:5:\\"class\\";s:16:\\"App\\\\Models\\\\Order\\";s:2:\\"id\\";i:34;s:9:\\"relations\\";a:3:{i:0;s:4:\\"user\\";i:1;s:5:\\"items\\";i:2;s:13:\\"items.product\\";}s:10:\\"connection\\";s:5:\\"pgsql\\";s:15:\\"collectionClass\\";N;}s:2:\\"to\\";a:1:{i:0;a:2:{s:4:\\"name\\";N;s:7:\\"address\\";s:24:\\"smart.gaming86@gmail.com\\";}}s:6:\\"mailer\\";s:4:\\"smtp\\";}s:5:\\"tries\\";N;s:7:\\"timeout\\";N;s:13:\\"maxExceptions\\";N;s:17:\\"shouldBeEncrypted\\";b:0;s:10:\\"connection\\";N;s:5:\\"queue\\";N;s:5:\\"delay\\";N;s:11:\\"afterCommit\\";N;s:10:\\"middleware\\";a:0:{}s:7:\\"chained\\";a:0:{}s:15:\\"chainConnection\\";N;s:10:\\"chainQueue\\";N;s:19:\\"chainCatchCallbacks\\";N;s:3:\\"job\\";N;}"},"createdAt":1773186001,"delay":null}	ErrorException: Attempt to read property "name" on null in C:\\Users\\DELL\\primeshop\\PRIME-SHOP\\storage\\framework\\views\\9d606e6d2dba51b7f3f336aa7cbe7031.php:43\nStack trace:\n#0 C:\\Users\\DELL\\primeshop\\PRIME-SHOP\\vendor\\laravel\\framework\\src\\Illuminate\\Foundation\\Bootstrap\\HandleExceptions.php(256): Illuminate\\Foundation\\Bootstrap\\HandleExceptions->handleError(2, 'Attempt to read...', 'C:\\\\Users\\\\DELL\\\\p...', 43)\n#1 C:\\Users\\DELL\\primeshop\\PRIME-SHOP\\storage\\framework\\views\\9d606e6d2dba51b7f3f336aa7cbe7031.php(43): Illuminate\\Foundation\\Bootstrap\\HandleExceptions->Illuminate\\Foundation\\Bootstrap\\{closure}(2, 'Attempt to read...', 'C:\\\\Users\\\\DELL\\\\p...', 43)\n#2 C:\\Users\\DELL\\primeshop\\PRIME-SHOP\\vendor\\laravel\\framework\\src\\Illuminate\\Filesystem\\Filesystem.php(123): require('C:\\\\Users\\\\DELL\\\\p...')\n#3 C:\\Users\\DELL\\primeshop\\PRIME-SHOP\\vendor\\laravel\\framework\\src\\Illuminate\\Filesystem\\Filesystem.php(124): Illuminate\\Filesystem\\Filesystem::Illuminate\\Filesystem\\{closure}()\n#4 C:\\Users\\DELL\\primeshop\\PRIME-SHOP\\vendor\\laravel\\framework\\src\\Illuminate\\View\\Engines\\PhpEngine.php(57): Illuminate\\Filesystem\\Filesystem->getRequire('C:\\\\Users\\\\DELL\\\\p...', Array)\n#5 C:\\Users\\DELL\\primeshop\\PRIME-SHOP\\vendor\\laravel\\framework\\src\\Illuminate\\View\\Engines\\CompilerEngine.php(76): Illuminate\\View\\Engines\\PhpEngine->evaluatePath('C:\\\\Users\\\\DELL\\\\p...', Array)\n#6 C:\\Users\\DELL\\primeshop\\PRIME-SHOP\\vendor\\laravel\\framework\\src\\Illuminate\\View\\View.php(208): Illuminate\\View\\Engines\\CompilerEngine->get('C:\\\\Users\\\\DELL\\\\p...', Array)\n#7 C:\\Users\\DELL\\primeshop\\PRIME-SHOP\\vendor\\laravel\\framework\\src\\Illuminate\\View\\View.php(191): Illuminate\\View\\View->getContents()\n#8 C:\\Users\\DELL\\primeshop\\PRIME-SHOP\\vendor\\laravel\\framework\\src\\Illuminate\\View\\View.php(160): Illuminate\\View\\View->renderContents()\n#9 C:\\Users\\DELL\\primeshop\\PRIME-SHOP\\vendor\\barryvdh\\laravel-dompdf\\src\\PDF.php(142): Illuminate\\View\\View->render()\n#10 C:\\Users\\DELL\\primeshop\\PRIME-SHOP\\vendor\\barryvdh\\laravel-dompdf\\src\\Facade\\Pdf.php(66): Barryvdh\\DomPDF\\PDF->loadView('pdfs.invoice', Array)\n#11 C:\\Users\\DELL\\primeshop\\PRIME-SHOP\\app\\Mail\\OrderConfirmationMail.php(42): Barryvdh\\DomPDF\\Facade\\Pdf::__callStatic('loadView', Array)\n#12 C:\\Users\\DELL\\primeshop\\PRIME-SHOP\\vendor\\laravel\\framework\\src\\Illuminate\\Mail\\Mailable.php(1810): App\\Mail\\OrderConfirmationMail->attachments()\n#13 C:\\Users\\DELL\\primeshop\\PRIME-SHOP\\vendor\\laravel\\framework\\src\\Illuminate\\Mail\\Mailable.php(1690): Illuminate\\Mail\\Mailable->ensureAttachmentsAreHydrated()\n#14 C:\\Users\\DELL\\primeshop\\PRIME-SHOP\\vendor\\laravel\\framework\\src\\Illuminate\\Mail\\Mailable.php(201): Illuminate\\Mail\\Mailable->prepareMailableForDelivery()\n#15 C:\\Users\\DELL\\primeshop\\PRIME-SHOP\\vendor\\laravel\\framework\\src\\Illuminate\\Support\\Traits\\Localizable.php(19): Illuminate\\Mail\\Mailable->Illuminate\\Mail\\{closure}()\n#16 C:\\Users\\DELL\\primeshop\\PRIME-SHOP\\vendor\\laravel\\framework\\src\\Illuminate\\Mail\\Mailable.php(200): Illuminate\\Mail\\Mailable->withLocale(NULL, Object(Closure))\n#17 C:\\Users\\DELL\\primeshop\\PRIME-SHOP\\vendor\\laravel\\framework\\src\\Illuminate\\Mail\\SendQueuedMailable.php(82): Illuminate\\Mail\\Mailable->send(Object(Illuminate\\Mail\\MailManager))\n#18 C:\\Users\\DELL\\primeshop\\PRIME-SHOP\\vendor\\laravel\\framework\\src\\Illuminate\\Container\\BoundMethod.php(36): Illuminate\\Mail\\SendQueuedMailable->handle(Object(Illuminate\\Mail\\MailManager))\n#19 C:\\Users\\DELL\\primeshop\\PRIME-SHOP\\vendor\\laravel\\framework\\src\\Illuminate\\Container\\Util.php(43): Illuminate\\Container\\BoundMethod::Illuminate\\Container\\{closure}()\n#20 C:\\Users\\DELL\\primeshop\\PRIME-SHOP\\vendor\\laravel\\framework\\src\\Illuminate\\Container\\BoundMethod.php(96): Illuminate\\Container\\Util::unwrapIfClosure(Object(Closure))\n#21 C:\\Users\\DELL\\primeshop\\PRIME-SHOP\\vendor\\laravel\\framework\\src\\Illuminate\\Container\\BoundMethod.php(35): Illuminate\\Container\\BoundMethod::callBoundMethod(Object(Illuminate\\Foundation\\Application), Array, Object(Closure))\n#22 C:\\Users\\DELL\\primeshop\\PRIME-SHOP\\vendor\\laravel\\framework\\src\\Illuminate\\Container\\Container.php(780): Illuminate\\Container\\BoundMethod::call(Object(Illuminate\\Foundation\\Application), Array, Array, NULL)\n#23 C:\\Users\\DELL\\primeshop\\PRIME-SHOP\\vendor\\laravel\\framework\\src\\Illuminate\\Bus\\Dispatcher.php(132): Illuminate\\Container\\Container->call(Array)\n#24 C:\\Users\\DELL\\primeshop\\PRIME-SHOP\\vendor\\laravel\\framework\\src\\Illuminate\\Pipeline\\Pipeline.php(169): Illuminate\\Bus\\Dispatcher->Illuminate\\Bus\\{closure}(Object(Illuminate\\Mail\\SendQueuedMailable))\n#25 C:\\Users\\DELL\\primeshop\\PRIME-SHOP\\vendor\\laravel\\framework\\src\\Illuminate\\Pipeline\\Pipeline.php(126): Illuminate\\Pipeline\\Pipeline->Illuminate\\Pipeline\\{closure}(Object(Illuminate\\Mail\\SendQueuedMailable))\n#26 C:\\Users\\DELL\\primeshop\\PRIME-SHOP\\vendor\\laravel\\framework\\src\\Illuminate\\Bus\\Dispatcher.php(136): Illuminate\\Pipeline\\Pipeline->then(Object(Closure))\n#27 C:\\Users\\DELL\\primeshop\\PRIME-SHOP\\vendor\\laravel\\framework\\src\\Illuminate\\Queue\\CallQueuedHandler.php(134): Illuminate\\Bus\\Dispatcher->dispatchNow(Object(Illuminate\\Mail\\SendQueuedMailable), false)\n#28 C:\\Users\\DELL\\primeshop\\PRIME-SHOP\\vendor\\laravel\\framework\\src\\Illuminate\\Pipeline\\Pipeline.php(169): Illuminate\\Queue\\CallQueuedHandler->Illuminate\\Queue\\{closure}(Object(Illuminate\\Mail\\SendQueuedMailable))\n#29 C:\\Users\\DELL\\primeshop\\PRIME-SHOP\\vendor\\laravel\\framework\\src\\Illuminate\\Pipeline\\Pipeline.php(126): Illuminate\\Pipeline\\Pipeline->Illuminate\\Pipeline\\{closure}(Object(Illuminate\\Mail\\SendQueuedMailable))\n#30 C:\\Users\\DELL\\primeshop\\PRIME-SHOP\\vendor\\laravel\\framework\\src\\Illuminate\\Queue\\CallQueuedHandler.php(127): Illuminate\\Pipeline\\Pipeline->then(Object(Closure))\n#31 C:\\Users\\DELL\\primeshop\\PRIME-SHOP\\vendor\\laravel\\framework\\src\\Illuminate\\Queue\\CallQueuedHandler.php(68): Illuminate\\Queue\\CallQueuedHandler->dispatchThroughMiddleware(Object(Illuminate\\Queue\\Jobs\\DatabaseJob), Object(Illuminate\\Mail\\SendQueuedMailable))\n#32 C:\\Users\\DELL\\primeshop\\PRIME-SHOP\\vendor\\laravel\\framework\\src\\Illuminate\\Queue\\Jobs\\Job.php(102): Illuminate\\Queue\\CallQueuedHandler->call(Object(Illuminate\\Queue\\Jobs\\DatabaseJob), Array)\n#33 C:\\Users\\DELL\\primeshop\\PRIME-SHOP\\vendor\\laravel\\framework\\src\\Illuminate\\Queue\\Worker.php(444): Illuminate\\Queue\\Jobs\\Job->fire()\n#34 C:\\Users\\DELL\\primeshop\\PRIME-SHOP\\vendor\\laravel\\framework\\src\\Illuminate\\Queue\\Worker.php(394): Illuminate\\Queue\\Worker->process('database', Object(Illuminate\\Queue\\Jobs\\DatabaseJob), Object(Illuminate\\Queue\\WorkerOptions))\n#35 C:\\Users\\DELL\\primeshop\\PRIME-SHOP\\vendor\\laravel\\framework\\src\\Illuminate\\Queue\\Worker.php(180): Illuminate\\Queue\\Worker->runJob(Object(Illuminate\\Queue\\Jobs\\DatabaseJob), 'database', Object(Illuminate\\Queue\\WorkerOptions))\n#36 C:\\Users\\DELL\\primeshop\\PRIME-SHOP\\vendor\\laravel\\framework\\src\\Illuminate\\Queue\\Console\\WorkCommand.php(148): Illuminate\\Queue\\Worker->daemon('database', 'default', Object(Illuminate\\Queue\\WorkerOptions))\n#37 C:\\Users\\DELL\\primeshop\\PRIME-SHOP\\vendor\\laravel\\framework\\src\\Illuminate\\Queue\\Console\\WorkCommand.php(131): Illuminate\\Queue\\Console\\WorkCommand->runWorker('database', 'default')\n#38 C:\\Users\\DELL\\primeshop\\PRIME-SHOP\\vendor\\laravel\\framework\\src\\Illuminate\\Container\\BoundMethod.php(36): Illuminate\\Queue\\Console\\WorkCommand->handle()\n#39 C:\\Users\\DELL\\primeshop\\PRIME-SHOP\\vendor\\laravel\\framework\\src\\Illuminate\\Container\\Util.php(43): Illuminate\\Container\\BoundMethod::Illuminate\\Container\\{closure}()\n#40 C:\\Users\\DELL\\primeshop\\PRIME-SHOP\\vendor\\laravel\\framework\\src\\Illuminate\\Container\\BoundMethod.php(96): Illuminate\\Container\\Util::unwrapIfClosure(Object(Closure))\n#41 C:\\Users\\DELL\\primeshop\\PRIME-SHOP\\vendor\\laravel\\framework\\src\\Illuminate\\Container\\BoundMethod.php(35): Illuminate\\Container\\BoundMethod::callBoundMethod(Object(Illuminate\\Foundation\\Application), Array, Object(Closure))\n#42 C:\\Users\\DELL\\primeshop\\PRIME-SHOP\\vendor\\laravel\\framework\\src\\Illuminate\\Container\\Container.php(780): Illuminate\\Container\\BoundMethod::call(Object(Illuminate\\Foundation\\Application), Array, Array, NULL)\n#43 C:\\Users\\DELL\\primeshop\\PRIME-SHOP\\vendor\\laravel\\framework\\src\\Illuminate\\Console\\Command.php(211): Illuminate\\Container\\Container->call(Array)\n#44 C:\\Users\\DELL\\primeshop\\PRIME-SHOP\\vendor\\symfony\\console\\Command\\Command.php(318): Illuminate\\Console\\Command->execute(Object(Symfony\\Component\\Console\\Input\\ArgvInput), Object(Illuminate\\Console\\OutputStyle))\n#45 C:\\Users\\DELL\\primeshop\\PRIME-SHOP\\vendor\\laravel\\framework\\src\\Illuminate\\Console\\Command.php(180): Symfony\\Component\\Console\\Command\\Command->run(Object(Symfony\\Component\\Console\\Input\\ArgvInput), Object(Illuminate\\Console\\OutputStyle))\n#46 C:\\Users\\DELL\\primeshop\\PRIME-SHOP\\vendor\\symfony\\console\\Application.php(1092): Illuminate\\Console\\Command->run(Object(Symfony\\Component\\Console\\Input\\ArgvInput), Object(Symfony\\Component\\Console\\Output\\ConsoleOutput))\n#47 C:\\Users\\DELL\\primeshop\\PRIME-SHOP\\vendor\\symfony\\console\\Application.php(341): Symfony\\Component\\Console\\Application->doRunCommand(Object(Illuminate\\Queue\\Console\\WorkCommand), Object(Symfony\\Component\\Console\\Input\\ArgvInput), Object(Symfony\\Component\\Console\\Output\\ConsoleOutput))\n#48 C:\\Users\\DELL\\primeshop\\PRIME-SHOP\\vendor\\symfony\\console\\Application.php(192): Symfony\\Component\\Console\\Application->doRun(Object(Symfony\\Component\\Console\\Input\\ArgvInput), Object(Symfony\\Component\\Console\\Output\\ConsoleOutput))\n#49 C:\\Users\\DELL\\primeshop\\PRIME-SHOP\\vendor\\laravel\\framework\\src\\Illuminate\\Foundation\\Console\\Kernel.php(197): Symfony\\Component\\Console\\Application->run(Object(Symfony\\Component\\Console\\Input\\ArgvInput), Object(Symfony\\Component\\Console\\Output\\ConsoleOutput))\n#50 C:\\Users\\DELL\\primeshop\\PRIME-SHOP\\vendor\\laravel\\framework\\src\\Illuminate\\Foundation\\Application.php(1234): Illuminate\\Foundation\\Console\\Kernel->handle(Object(Symfony\\Component\\Console\\Input\\ArgvInput), Object(Symfony\\Component\\Console\\Output\\ConsoleOutput))\n#51 C:\\Users\\DELL\\primeshop\\PRIME-SHOP\\artisan(16): Illuminate\\Foundation\\Application->handleCommand(Object(Symfony\\Component\\Console\\Input\\ArgvInput))\n#52 {main}\n\nNext Illuminate\\View\\ViewException: Attempt to read property "name" on null (View: C:\\Users\\DELL\\primeshop\\PRIME-SHOP\\resources\\views\\pdfs\\invoice.blade.php) in C:\\Users\\DELL\\primeshop\\PRIME-SHOP\\storage\\framework\\views\\9d606e6d2dba51b7f3f336aa7cbe7031.php:43\nStack trace:\n#0 C:\\Users\\DELL\\primeshop\\PRIME-SHOP\\vendor\\laravel\\framework\\src\\Illuminate\\View\\Engines\\PhpEngine.php(59): Illuminate\\View\\Engines\\CompilerEngine->handleViewException(Object(ErrorException), 0)\n#1 C:\\Users\\DELL\\primeshop\\PRIME-SHOP\\vendor\\laravel\\framework\\src\\Illuminate\\View\\Engines\\CompilerEngine.php(76): Illuminate\\View\\Engines\\PhpEngine->evaluatePath('C:\\\\Users\\\\DELL\\\\p...', Array)\n#2 C:\\Users\\DELL\\primeshop\\PRIME-SHOP\\vendor\\laravel\\framework\\src\\Illuminate\\View\\View.php(208): Illuminate\\View\\Engines\\CompilerEngine->get('C:\\\\Users\\\\DELL\\\\p...', Array)\n#3 C:\\Users\\DELL\\primeshop\\PRIME-SHOP\\vendor\\laravel\\framework\\src\\Illuminate\\View\\View.php(191): Illuminate\\View\\View->getContents()\n#4 C:\\Users\\DELL\\primeshop\\PRIME-SHOP\\vendor\\laravel\\framework\\src\\Illuminate\\View\\View.php(160): Illuminate\\View\\View->renderContents()\n#5 C:\\Users\\DELL\\primeshop\\PRIME-SHOP\\vendor\\barryvdh\\laravel-dompdf\\src\\PDF.php(142): Illuminate\\View\\View->render()\n#6 C:\\Users\\DELL\\primeshop\\PRIME-SHOP\\vendor\\barryvdh\\laravel-dompdf\\src\\Facade\\Pdf.php(66): Barryvdh\\DomPDF\\PDF->loadView('pdfs.invoice', Array)\n#7 C:\\Users\\DELL\\primeshop\\PRIME-SHOP\\app\\Mail\\OrderConfirmationMail.php(42): Barryvdh\\DomPDF\\Facade\\Pdf::__callStatic('loadView', Array)\n#8 C:\\Users\\DELL\\primeshop\\PRIME-SHOP\\vendor\\laravel\\framework\\src\\Illuminate\\Mail\\Mailable.php(1810): App\\Mail\\OrderConfirmationMail->attachments()\n#9 C:\\Users\\DELL\\primeshop\\PRIME-SHOP\\vendor\\laravel\\framework\\src\\Illuminate\\Mail\\Mailable.php(1690): Illuminate\\Mail\\Mailable->ensureAttachmentsAreHydrated()\n#10 C:\\Users\\DELL\\primeshop\\PRIME-SHOP\\vendor\\laravel\\framework\\src\\Illuminate\\Mail\\Mailable.php(201): Illuminate\\Mail\\Mailable->prepareMailableForDelivery()\n#11 C:\\Users\\DELL\\primeshop\\PRIME-SHOP\\vendor\\laravel\\framework\\src\\Illuminate\\Support\\Traits\\Localizable.php(19): Illuminate\\Mail\\Mailable->Illuminate\\Mail\\{closure}()\n#12 C:\\Users\\DELL\\primeshop\\PRIME-SHOP\\vendor\\laravel\\framework\\src\\Illuminate\\Mail\\Mailable.php(200): Illuminate\\Mail\\Mailable->withLocale(NULL, Object(Closure))\n#13 C:\\Users\\DELL\\primeshop\\PRIME-SHOP\\vendor\\laravel\\framework\\src\\Illuminate\\Mail\\SendQueuedMailable.php(82): Illuminate\\Mail\\Mailable->send(Object(Illuminate\\Mail\\MailManager))\n#14 C:\\Users\\DELL\\primeshop\\PRIME-SHOP\\vendor\\laravel\\framework\\src\\Illuminate\\Container\\BoundMethod.php(36): Illuminate\\Mail\\SendQueuedMailable->handle(Object(Illuminate\\Mail\\MailManager))\n#15 C:\\Users\\DELL\\primeshop\\PRIME-SHOP\\vendor\\laravel\\framework\\src\\Illuminate\\Container\\Util.php(43): Illuminate\\Container\\BoundMethod::Illuminate\\Container\\{closure}()\n#16 C:\\Users\\DELL\\primeshop\\PRIME-SHOP\\vendor\\laravel\\framework\\src\\Illuminate\\Container\\BoundMethod.php(96): Illuminate\\Container\\Util::unwrapIfClosure(Object(Closure))\n#17 C:\\Users\\DELL\\primeshop\\PRIME-SHOP\\vendor\\laravel\\framework\\src\\Illuminate\\Container\\BoundMethod.php(35): Illuminate\\Container\\BoundMethod::callBoundMethod(Object(Illuminate\\Foundation\\Application), Array, Object(Closure))\n#18 C:\\Users\\DELL\\primeshop\\PRIME-SHOP\\vendor\\laravel\\framework\\src\\Illuminate\\Container\\Container.php(780): Illuminate\\Container\\BoundMethod::call(Object(Illuminate\\Foundation\\Application), Array, Array, NULL)\n#19 C:\\Users\\DELL\\primeshop\\PRIME-SHOP\\vendor\\laravel\\framework\\src\\Illuminate\\Bus\\Dispatcher.php(132): Illuminate\\Container\\Container->call(Array)\n#20 C:\\Users\\DELL\\primeshop\\PRIME-SHOP\\vendor\\laravel\\framework\\src\\Illuminate\\Pipeline\\Pipeline.php(169): Illuminate\\Bus\\Dispatcher->Illuminate\\Bus\\{closure}(Object(Illuminate\\Mail\\SendQueuedMailable))\n#21 C:\\Users\\DELL\\primeshop\\PRIME-SHOP\\vendor\\laravel\\framework\\src\\Illuminate\\Pipeline\\Pipeline.php(126): Illuminate\\Pipeline\\Pipeline->Illuminate\\Pipeline\\{closure}(Object(Illuminate\\Mail\\SendQueuedMailable))\n#22 C:\\Users\\DELL\\primeshop\\PRIME-SHOP\\vendor\\laravel\\framework\\src\\Illuminate\\Bus\\Dispatcher.php(136): Illuminate\\Pipeline\\Pipeline->then(Object(Closure))\n#23 C:\\Users\\DELL\\primeshop\\PRIME-SHOP\\vendor\\laravel\\framework\\src\\Illuminate\\Queue\\CallQueuedHandler.php(134): Illuminate\\Bus\\Dispatcher->dispatchNow(Object(Illuminate\\Mail\\SendQueuedMailable), false)\n#24 C:\\Users\\DELL\\primeshop\\PRIME-SHOP\\vendor\\laravel\\framework\\src\\Illuminate\\Pipeline\\Pipeline.php(169): Illuminate\\Queue\\CallQueuedHandler->Illuminate\\Queue\\{closure}(Object(Illuminate\\Mail\\SendQueuedMailable))\n#25 C:\\Users\\DELL\\primeshop\\PRIME-SHOP\\vendor\\laravel\\framework\\src\\Illuminate\\Pipeline\\Pipeline.php(126): Illuminate\\Pipeline\\Pipeline->Illuminate\\Pipeline\\{closure}(Object(Illuminate\\Mail\\SendQueuedMailable))\n#26 C:\\Users\\DELL\\primeshop\\PRIME-SHOP\\vendor\\laravel\\framework\\src\\Illuminate\\Queue\\CallQueuedHandler.php(127): Illuminate\\Pipeline\\Pipeline->then(Object(Closure))\n#27 C:\\Users\\DELL\\primeshop\\PRIME-SHOP\\vendor\\laravel\\framework\\src\\Illuminate\\Queue\\CallQueuedHandler.php(68): Illuminate\\Queue\\CallQueuedHandler->dispatchThroughMiddleware(Object(Illuminate\\Queue\\Jobs\\DatabaseJob), Object(Illuminate\\Mail\\SendQueuedMailable))\n#28 C:\\Users\\DELL\\primeshop\\PRIME-SHOP\\vendor\\laravel\\framework\\src\\Illuminate\\Queue\\Jobs\\Job.php(102): Illuminate\\Queue\\CallQueuedHandler->call(Object(Illuminate\\Queue\\Jobs\\DatabaseJob), Array)\n#29 C:\\Users\\DELL\\primeshop\\PRIME-SHOP\\vendor\\laravel\\framework\\src\\Illuminate\\Queue\\Worker.php(444): Illuminate\\Queue\\Jobs\\Job->fire()\n#30 C:\\Users\\DELL\\primeshop\\PRIME-SHOP\\vendor\\laravel\\framework\\src\\Illuminate\\Queue\\Worker.php(394): Illuminate\\Queue\\Worker->process('database', Object(Illuminate\\Queue\\Jobs\\DatabaseJob), Object(Illuminate\\Queue\\WorkerOptions))\n#31 C:\\Users\\DELL\\primeshop\\PRIME-SHOP\\vendor\\laravel\\framework\\src\\Illuminate\\Queue\\Worker.php(180): Illuminate\\Queue\\Worker->runJob(Object(Illuminate\\Queue\\Jobs\\DatabaseJob), 'database', Object(Illuminate\\Queue\\WorkerOptions))\n#32 C:\\Users\\DELL\\primeshop\\PRIME-SHOP\\vendor\\laravel\\framework\\src\\Illuminate\\Queue\\Console\\WorkCommand.php(148): Illuminate\\Queue\\Worker->daemon('database', 'default', Object(Illuminate\\Queue\\WorkerOptions))\n#33 C:\\Users\\DELL\\primeshop\\PRIME-SHOP\\vendor\\laravel\\framework\\src\\Illuminate\\Queue\\Console\\WorkCommand.php(131): Illuminate\\Queue\\Console\\WorkCommand->runWorker('database', 'default')\n#34 C:\\Users\\DELL\\primeshop\\PRIME-SHOP\\vendor\\laravel\\framework\\src\\Illuminate\\Container\\BoundMethod.php(36): Illuminate\\Queue\\Console\\WorkCommand->handle()\n#35 C:\\Users\\DELL\\primeshop\\PRIME-SHOP\\vendor\\laravel\\framework\\src\\Illuminate\\Container\\Util.php(43): Illuminate\\Container\\BoundMethod::Illuminate\\Container\\{closure}()\n#36 C:\\Users\\DELL\\primeshop\\PRIME-SHOP\\vendor\\laravel\\framework\\src\\Illuminate\\Container\\BoundMethod.php(96): Illuminate\\Container\\Util::unwrapIfClosure(Object(Closure))\n#37 C:\\Users\\DELL\\primeshop\\PRIME-SHOP\\vendor\\laravel\\framework\\src\\Illuminate\\Container\\BoundMethod.php(35): Illuminate\\Container\\BoundMethod::callBoundMethod(Object(Illuminate\\Foundation\\Application), Array, Object(Closure))\n#38 C:\\Users\\DELL\\primeshop\\PRIME-SHOP\\vendor\\laravel\\framework\\src\\Illuminate\\Container\\Container.php(780): Illuminate\\Container\\BoundMethod::call(Object(Illuminate\\Foundation\\Application), Array, Array, NULL)\n#39 C:\\Users\\DELL\\primeshop\\PRIME-SHOP\\vendor\\laravel\\framework\\src\\Illuminate\\Console\\Command.php(211): Illuminate\\Container\\Container->call(Array)\n#40 C:\\Users\\DELL\\primeshop\\PRIME-SHOP\\vendor\\symfony\\console\\Command\\Command.php(318): Illuminate\\Console\\Command->execute(Object(Symfony\\Component\\Console\\Input\\ArgvInput), Object(Illuminate\\Console\\OutputStyle))\n#41 C:\\Users\\DELL\\primeshop\\PRIME-SHOP\\vendor\\laravel\\framework\\src\\Illuminate\\Console\\Command.php(180): Symfony\\Component\\Console\\Command\\Command->run(Object(Symfony\\Component\\Console\\Input\\ArgvInput), Object(Illuminate\\Console\\OutputStyle))\n#42 C:\\Users\\DELL\\primeshop\\PRIME-SHOP\\vendor\\symfony\\console\\Application.php(1092): Illuminate\\Console\\Command->run(Object(Symfony\\Component\\Console\\Input\\ArgvInput), Object(Symfony\\Component\\Console\\Output\\ConsoleOutput))\n#43 C:\\Users\\DELL\\primeshop\\PRIME-SHOP\\vendor\\symfony\\console\\Application.php(341): Symfony\\Component\\Console\\Application->doRunCommand(Object(Illuminate\\Queue\\Console\\WorkCommand), Object(Symfony\\Component\\Console\\Input\\ArgvInput), Object(Symfony\\Component\\Console\\Output\\ConsoleOutput))\n#44 C:\\Users\\DELL\\primeshop\\PRIME-SHOP\\vendor\\symfony\\console\\Application.php(192): Symfony\\Component\\Console\\Application->doRun(Object(Symfony\\Component\\Console\\Input\\ArgvInput), Object(Symfony\\Component\\Console\\Output\\ConsoleOutput))\n#45 C:\\Users\\DELL\\primeshop\\PRIME-SHOP\\vendor\\laravel\\framework\\src\\Illuminate\\Foundation\\Console\\Kernel.php(197): Symfony\\Component\\Console\\Application->run(Object(Symfony\\Component\\Console\\Input\\ArgvInput), Object(Symfony\\Component\\Console\\Output\\ConsoleOutput))\n#46 C:\\Users\\DELL\\primeshop\\PRIME-SHOP\\vendor\\laravel\\framework\\src\\Illuminate\\Foundation\\Application.php(1234): Illuminate\\Foundation\\Console\\Kernel->handle(Object(Symfony\\Component\\Console\\Input\\ArgvInput), Object(Symfony\\Component\\Console\\Output\\ConsoleOutput))\n#47 C:\\Users\\DELL\\primeshop\\PRIME-SHOP\\artisan(16): Illuminate\\Foundation\\Application->handleCommand(Object(Symfony\\Component\\Console\\Input\\ArgvInput))\n#48 {main}	2026-03-10 23:40:02
\.


--
-- Data for Name: job_batches; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.job_batches (id, name, total_jobs, pending_jobs, failed_jobs, failed_job_ids, options, cancelled_at, created_at, finished_at) FROM stdin;
\.


--
-- Data for Name: jobs; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.jobs (id, queue, payload, attempts, reserved_at, available_at, created_at) FROM stdin;
16	default	{"uuid":"390f621e-0d4a-4372-98ae-47ce000aa7bc","displayName":"App\\\\Mail\\\\OrderConfirmationMail","job":"Illuminate\\\\Queue\\\\CallQueuedHandler@call","maxTries":null,"maxExceptions":null,"failOnTimeout":false,"backoff":null,"timeout":null,"retryUntil":null,"data":{"commandName":"Illuminate\\\\Mail\\\\SendQueuedMailable","command":"O:34:\\"Illuminate\\\\Mail\\\\SendQueuedMailable\\":15:{s:8:\\"mailable\\";O:30:\\"App\\\\Mail\\\\OrderConfirmationMail\\":3:{s:5:\\"order\\";O:45:\\"Illuminate\\\\Contracts\\\\Database\\\\ModelIdentifier\\":5:{s:5:\\"class\\";s:16:\\"App\\\\Models\\\\Order\\";s:2:\\"id\\";i:36;s:9:\\"relations\\";a:3:{i:0;s:4:\\"user\\";i:1;s:5:\\"items\\";i:2;s:13:\\"items.product\\";}s:10:\\"connection\\";s:5:\\"pgsql\\";s:15:\\"collectionClass\\";N;}s:2:\\"to\\";a:1:{i:0;a:2:{s:4:\\"name\\";N;s:7:\\"address\\";s:14:\\"gmail@yahoo.fr\\";}}s:6:\\"mailer\\";s:4:\\"smtp\\";}s:5:\\"tries\\";N;s:7:\\"timeout\\";N;s:13:\\"maxExceptions\\";N;s:17:\\"shouldBeEncrypted\\";b:0;s:10:\\"connection\\";N;s:5:\\"queue\\";N;s:5:\\"delay\\";N;s:11:\\"afterCommit\\";N;s:10:\\"middleware\\";a:0:{}s:7:\\"chained\\";a:0:{}s:15:\\"chainConnection\\";N;s:10:\\"chainQueue\\";N;s:19:\\"chainCatchCallbacks\\";N;s:3:\\"job\\";N;}"},"createdAt":1773248692,"delay":null}	0	\N	1773248692	1773248692
17	default	{"uuid":"c06f6e56-1c00-4774-b587-b35cbc3bea78","displayName":"App\\\\Mail\\\\OrderConfirmationMail","job":"Illuminate\\\\Queue\\\\CallQueuedHandler@call","maxTries":null,"maxExceptions":null,"failOnTimeout":false,"backoff":null,"timeout":null,"retryUntil":null,"data":{"commandName":"Illuminate\\\\Mail\\\\SendQueuedMailable","command":"O:34:\\"Illuminate\\\\Mail\\\\SendQueuedMailable\\":15:{s:8:\\"mailable\\";O:30:\\"App\\\\Mail\\\\OrderConfirmationMail\\":3:{s:5:\\"order\\";O:45:\\"Illuminate\\\\Contracts\\\\Database\\\\ModelIdentifier\\":5:{s:5:\\"class\\";s:16:\\"App\\\\Models\\\\Order\\";s:2:\\"id\\";i:37;s:9:\\"relations\\";a:3:{i:0;s:4:\\"user\\";i:1;s:5:\\"items\\";i:2;s:13:\\"items.product\\";}s:10:\\"connection\\";s:5:\\"pgsql\\";s:15:\\"collectionClass\\";N;}s:2:\\"to\\";a:1:{i:0;a:2:{s:4:\\"name\\";N;s:7:\\"address\\";s:15:\\"hmada@email.com\\";}}s:6:\\"mailer\\";s:4:\\"smtp\\";}s:5:\\"tries\\";N;s:7:\\"timeout\\";N;s:13:\\"maxExceptions\\";N;s:17:\\"shouldBeEncrypted\\";b:0;s:10:\\"connection\\";N;s:5:\\"queue\\";N;s:5:\\"delay\\";N;s:11:\\"afterCommit\\";N;s:10:\\"middleware\\";a:0:{}s:7:\\"chained\\";a:0:{}s:15:\\"chainConnection\\";N;s:10:\\"chainQueue\\";N;s:19:\\"chainCatchCallbacks\\";N;s:3:\\"job\\";N;}"},"createdAt":1773249425,"delay":null}	0	\N	1773249425	1773249425
\.


--
-- Data for Name: migrations; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.migrations (id, migration, batch) FROM stdin;
1	0001_01_01_000001_create_cache_table	1
2	0001_01_01_000002_create_jobs_table	1
3	2025_10_27_123410_category	1
4	2025_10_29_000000_create_products_table	1
5	2025_10_29_135532_create_sessions_table	2
6	2025_10_29_135907_create_users_table	3
7	2025_10_29_140303_add_role_to_users_table	4
8	2025_10_29_144236_add_image_to_products_table	5
9	2025_12_01_093939_add_phone_picture_address_to_users_table	6
10	2025_12_09_130753_create_orders_table	7
11	2025_12_09_130754_create_order_items_table	7
12	2025_12_23_102137_add_delivery_type_to_orders_table	8
13	2026_02_19_000000_make_user_id_nullable_in_orders_table	9
14	2026_02_19_100000_add_google_oauth_fields_to_users_table	10
15	2026_03_04_162159_create_personal_access_tokens_table	10
16	2026_03_10_155707_add_stripe_fields_to_orders	11
\.


--
-- Data for Name: order_items; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.order_items (id, order_id, product_id, product_name, product_price, quantity, subtotal, created_at, updated_at) FROM stdin;
1	1	19	Wireless Headphones	895.00	1	895.00	2025-12-23 11:16:10	2025-12-23 11:16:10
2	2	19	Wireless Headphones	895.00	1	895.00	2025-12-23 11:17:50	2025-12-23 11:17:50
3	3	19	Wireless Headphones	895.00	1	895.00	2025-12-23 11:48:23	2025-12-23 11:48:23
4	4	18	ELECTRO	50.00	1	50.00	2025-12-23 11:59:54	2025-12-23 11:59:54
5	5	18	ELECTRO	50.00	1	50.00	2025-12-23 12:01:11	2025-12-23 12:01:11
6	5	21	ZMARTZINXD	10.00	1	10.00	2025-12-23 12:01:11	2025-12-23 12:01:11
7	5	15	CASSQUE	50.00	1	50.00	2025-12-23 12:01:11	2025-12-23 12:01:11
8	6	15	CASSQUE	50.00	1	50.00	2025-12-24 10:26:24	2025-12-24 10:26:24
9	7	18	ELECTRO	50.00	1	50.00	2025-12-24 10:39:50	2025-12-24 10:39:50
10	8	19	Wireless Headphones	895.00	1	895.00	2025-12-24 10:46:55	2025-12-24 10:46:55
11	9	18	ELECTRO	50.00	1	50.00	2025-12-24 10:53:11	2025-12-24 10:53:11
12	9	19	Wireless Headphones	895.00	1	895.00	2025-12-24 10:53:11	2025-12-24 10:53:11
13	10	19	Wireless Headphones	895.00	1	895.00	2025-12-24 10:58:36	2025-12-24 10:58:36
14	11	18	ELECTRO	50.00	1	50.00	2025-12-24 16:38:44	2025-12-24 16:38:44
15	11	21	ZMARTZINXD	10.00	1	10.00	2025-12-24 16:38:44	2025-12-24 16:38:44
16	12	19	Wireless Headphones	895.00	1	895.00	2025-12-24 17:09:47	2025-12-24 17:09:47
17	13	19	Wireless Headphones	895.00	1	895.00	2025-12-25 18:29:21	2025-12-25 18:29:21
18	14	15	CASSQUE	50.00	1	50.00	2026-02-19 12:57:19	2026-02-19 12:57:19
19	14	18	ELECTRO	50.00	1	50.00	2026-02-19 12:57:19	2026-02-19 12:57:19
20	17	18	ELECTRO	50.00	2	100.00	2026-02-19 13:35:20	2026-02-19 13:35:20
21	17	19	Wireless Headphones	895.00	1	895.00	2026-02-19 13:35:20	2026-02-19 13:35:20
22	18	18	ELECTRO	50.00	2	100.00	2026-02-23 00:33:46	2026-02-23 00:33:46
23	18	19	Wireless Headphones	895.00	2	1790.00	2026-02-23 00:33:46	2026-02-23 00:33:46
24	19	19	Wireless Headphones	895.00	1	895.00	2026-03-05 15:21:06	2026-03-05 15:21:06
25	19	21	ZMARTZINXD	10.00	1	10.00	2026-03-05 15:21:06	2026-03-05 15:21:06
29	21	22	Wirless Headphones	554.00	1	554.00	2026-03-06 17:05:53	2026-03-06 17:05:53
30	22	19	Wireless Headphones	895.00	1	895.00	2026-03-06 17:11:20	2026-03-06 17:11:20
31	22	21	ZMARTZINXD	10.00	1	10.00	2026-03-06 17:11:20	2026-03-06 17:11:20
32	23	15	CASSQUE	50.00	1	50.00	2026-03-06 17:14:12	2026-03-06 17:14:12
33	24	19	Wireless Headphones	895.00	1	895.00	2026-03-07 15:22:10	2026-03-07 15:22:10
34	25	22	Wirless Headphones	554.00	1	554.00	2026-03-07 15:27:52	2026-03-07 15:27:52
35	25	21	ZMARTZINXD	10.00	1	10.00	2026-03-07 15:27:52	2026-03-07 15:27:52
36	26	18	ELECTRO	50.00	1	50.00	2026-03-10 16:56:14	2026-03-10 16:56:14
37	26	19	Wireless Headphones	895.00	1	895.00	2026-03-10 16:56:14	2026-03-10 16:56:14
38	27	19	Wireless Headphones	895.00	1	895.00	2026-03-10 16:57:12	2026-03-10 16:57:12
39	27	21	ZMARTZINXD	10.00	1	10.00	2026-03-10 16:57:12	2026-03-10 16:57:12
40	27	18	ELECTRO	50.00	1	50.00	2026-03-10 16:57:12	2026-03-10 16:57:12
41	28	18	ELECTRO	50.00	1	50.00	2026-03-10 17:00:16	2026-03-10 17:00:16
42	28	19	Wireless Headphones	895.00	1	895.00	2026-03-10 17:00:16	2026-03-10 17:00:16
43	29	18	ELECTRO	50.00	1	50.00	2026-03-10 17:04:21	2026-03-10 17:04:21
44	29	19	Wireless Headphones	895.00	1	895.00	2026-03-10 17:04:21	2026-03-10 17:04:21
45	30	18	ELECTRO	50.00	1	50.00	2026-03-10 22:25:37	2026-03-10 22:25:37
46	31	18	ELECTRO	50.00	1	50.00	2026-03-10 22:26:46	2026-03-10 22:26:46
47	32	19	Wireless Headphones	895.00	1	895.00	2026-03-10 23:09:57	2026-03-10 23:09:57
48	32	21	ZMARTZINXD	10.00	1	10.00	2026-03-10 23:09:57	2026-03-10 23:09:57
49	33	18	ELECTRO	50.00	1	50.00	2026-03-10 23:13:55	2026-03-10 23:13:55
50	34	21	ZMARTZINXD	10.00	1	10.00	2026-03-10 23:40:01	2026-03-10 23:40:01
51	34	19	Wireless Headphones	895.00	3	2685.00	2026-03-10 23:40:01	2026-03-10 23:40:01
52	35	24	Sellion Artwork	59.00	1	59.00	2026-03-11 01:15:24	2026-03-11 01:15:24
53	35	18	ELECTRO	50.00	1	50.00	2026-03-11 01:15:24	2026-03-11 01:15:24
54	36	24	Sellion Artwork	59.00	1	59.00	2026-03-11 17:04:47	2026-03-11 17:04:47
55	37	15	CASSQUE	50.00	1	50.00	2026-03-11 17:17:05	2026-03-11 17:17:05
56	37	21	ZMARTZINXD	10.00	1	10.00	2026-03-11 17:17:05	2026-03-11 17:17:05
57	37	22	Wirless Headphones	554.00	1	554.00	2026-03-11 17:17:05	2026-03-11 17:17:05
\.


--
-- Data for Name: orders; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.orders (id, order_number, user_id, customer_name, customer_email, customer_phone, shipping_address, subtotal, shipping_cost, total, status, payment_method, payment_status, notes, created_at, updated_at, delivery_type, stripe_session_id, stripe_payment_intent) FROM stdin;
1	ORD-A06EF8	2	ZMART	client@gmail.com	+213 542710629	Mila-Oued Athmania - Aissat idir	895.00	80.00	975.00	pending	card	pending	\N	2025-12-23 11:16:10	2025-12-23 11:16:10	home	\N	\N
2	ORD-E2888F	2	ZMART	client@gmail.com	+213 542710629	Mila-Oued Athmania - Aissat idir	895.00	80.00	975.00	pending	card	pending	\N	2025-12-23 11:17:50	2025-12-23 11:17:50	home	\N	\N
3	ORD-7E4A00	2	ZMART	client@gmail.com	+213 542710629	Mila-Oued Athmania - Aissat idir	895.00	80.00	975.00	pending	cash	pending	HI	2025-12-23 11:48:23	2025-12-23 11:48:23	home	\N	\N
4	ORD-9F418F	2	ZMART	client@gmail.com	+213 542710629	Mila-Oued Athmania - Aissat idir	50.00	80.00	130.00	pending	card	pending	\N	2025-12-23 11:59:54	2025-12-23 11:59:54	home	\N	\N
5	ORD-73D276	2	ZMART	client@gmail.com	+213 542710629	Mila-Oued Athmania - Aissat idir	110.00	80.00	190.00	pending	card	pending	\N	2025-12-23 12:01:11	2025-12-23 12:01:11	home	\N	\N
6	ORD-0CD2A9	2	ZMART	client@gmail.com	+213 542710629	Mila-Oued Athmania - Aissat idir	50.00	80.00	130.00	pending	cash	pending	\N	2025-12-24 10:26:24	2025-12-24 10:26:24	home	\N	\N
7	ORD-608EE5	2	ZMART	client@gmail.com	+213 542710629	Mila-Oued Athmania - Aissat idir	50.00	80.00	130.00	pending	card	pending	\N	2025-12-24 10:39:50	2025-12-24 10:39:50	home	\N	\N
8	ORD-F7A56C	2	ZMART	client@gmail.com	+213 542710629	Mila-Oued Athmania - Aissat idir	895.00	80.00	975.00	pending	cash	pending	hii	2025-12-24 10:46:55	2025-12-24 10:46:55	home	\N	\N
9	ORD-789B8D	2	ZMART	client@gmail.com	+213 542710629	Mila-Oued Athmania - Aissat idir	945.00	80.00	1025.00	pending	paypal	pending	\N	2025-12-24 10:53:11	2025-12-24 10:53:11	home	\N	\N
10	ORD-CE11E8	2	ZMART	client@gmail.com	+213 542710629	Mila-Oued Athmania - Aissat idir	895.00	80.00	975.00	pending	card	pending	\N	2025-12-24 10:58:36	2025-12-24 10:58:36	home	\N	\N
11	ORD-4303DA	2	ZMART	client@gmail.com	+213 542710629	Mila-Oued Athmania - Aissat idir	60.00	80.00	140.00	pending	card	pending	\N	2025-12-24 16:38:44	2025-12-24 16:38:44	home	\N	\N
12	ORD-B40508	2	ZMART	client@gmail.com	+213 542710629	Mila-Oued Athmania - Aissat idir	895.00	80.00	975.00	pending	card	pending	\N	2025-12-24 17:09:47	2025-12-24 17:09:47	home	\N	\N
14	ORD-F95324	2	ZMART	client@gmail.com	+213 542710629	Mila-Oued Athmania - Aissat idir	100.00	80.00	180.00	confirmed	card	pending	\N	2026-02-19 12:57:19	2026-02-19 13:12:06	home	\N	\N
13	ORD-19B86F	2	ZMART	client@gmail.com	+213 542710629	Mila-Oued Athmania - Aissat idir	895.00	80.00	975.00	confirmed	card	pending	\N	2025-12-25 18:29:21	2026-02-19 13:12:18	home	\N	\N
17	ORD-8F0B5C	\N	hamada	email@email.com	975935299	cqcq	995.00	80.00	1075.00	confirmed	paypal	pending	\N	2026-02-19 13:35:20	2026-02-19 13:49:29	home	\N	\N
18	ORD-A7FA02	2	ZMART	client@gmail.com	+213 542710629	Mila-Oued Athmania - Aissat idir	1890.00	80.00	1970.00	pending	card	pending	\N	2026-02-23 00:33:46	2026-02-23 00:33:46	home	\N	\N
21	ORD-1775F1	6	Ahmed AMOKRANE	ahmed.amokrane@univ-constantine2.dz	0542428024	hello	609.00	80.00	689.00	pending	cash	pending	\N	2026-03-06 17:05:53	2026-03-06 17:05:53	home	\N	\N
22	ORD-80A42F	6	Ahmed AMOKRANE	ahmed.amokrane@univ-constantine2.dz	535253252	xDd	905.00	80.00	985.00	pending	cash	pending	Xdd	2026-03-06 17:11:20	2026-03-06 17:11:20	home	\N	\N
23	ORD-4D0E10	6	Ahmed AMOKRANE	ahmed.amokrane@univ-constantine2.dz	\N	hhhh	50.00	80.00	130.00	pending	card	pending	\N	2026-03-06 17:14:12	2026-03-06 17:14:12	home	\N	\N
25	ORD-8851F5	4	Amokrane Ahmed	amokrane.ahmed10@gmail.com	\N	hhh	564.00	80.00	644.00	confirmed	card	pending	\N	2026-03-07 15:27:52	2026-03-07 15:30:57	home	\N	\N
24	ORD-27062B	4	Amokrane Ahmed	amokrane.ahmed10@gmail.com	\N	24443	895.00	80.00	975.00	confirmed	card	pending	\N	2026-03-07 15:22:10	2026-03-07 15:31:01	home	\N	\N
19	ORD-2B2461	5	zmartzin	smart.gaming86@gmail.com	\N	aissat idir	905.00	80.00	985.00	confirmed	cash	pending	zmartcs	2026-03-05 15:21:06	2026-03-07 15:31:05	home	\N	\N
26	ORD-ED58D8	\N	zmart	hmada@email.com	5555	shipingz	945.00	80.00	1025.00	pending	card	pending	\N	2026-03-10 16:56:14	2026-03-10 16:56:14	home	\N	\N
27	ORD-88F344	4	Amokrane Ahmed	amokrane.ahmed10@gmail.com	\N	hamadaa	955.00	80.00	1035.00	pending	card	pending	\N	2026-03-10 16:57:12	2026-03-10 16:57:12	home	\N	\N
28	ORD-051935	4	Amokrane Ahmed	amokrane.ahmed10@gmail.com	\N	jjjj	945.00	80.00	1025.00	pending	card	pending	\N	2026-03-10 17:00:16	2026-03-10 17:00:16	home	\N	\N
29	ORD-513742	4	Amokrane Ahmed	amokrane.ahmed10@gmail.com	\N	jjjj	945.00	80.00	1025.00	pending	card	pending	\N	2026-03-10 17:04:21	2026-03-10 17:04:21	home	\N	\N
30	ORD-1CA726	5	zmartzin	smart.gaming86@gmail.com	\N	hihiilo	50.00	80.00	130.00	pending	card	pending	\N	2026-03-10 22:25:37	2026-03-10 22:25:37	home	\N	\N
31	ORD-6C0ED5	5	zmartzin	smart.gaming86@gmail.com	\N	lihlihlh	50.00	80.00	130.00	pending	cash	pending	\N	2026-03-10 22:26:46	2026-03-10 22:26:46	home	\N	\N
32	ORD-54E85C	5	zmartzin	smart.gaming86@gmail.com	\N	hamada	905.00	80.00	985.00	pending	cash	pending	\N	2026-03-10 23:09:57	2026-03-10 23:09:57	home	\N	\N
33	ORD-336B62	5	zmartzin	smart.gaming86@gmail.com	5555	ccc	50.00	80.00	130.00	pending	chargily	pending	\N	2026-03-10 23:13:55	2026-03-10 23:13:55	home	\N	\N
34	ORD-11576B	\N	hamada	smart.gaming86@gmail.com	+213 542710629	hhhh	2695.00	80.00	2775.00	pending	cash	pending	\N	2026-03-10 23:40:01	2026-03-10 23:40:01	home	\N	\N
35	ORD-C24D51	5	zmartzin	smart.gaming86@gmail.com	+213 542710629	CONSTANTINE	109.00	80.00	189.00	pending	cash	pending	\N	2026-03-11 01:15:24	2026-03-11 01:15:24	home	\N	\N
36	ORD-FDD7FD	\N	hhhhhhh	gmail@yahoo.fr	53525325252	adress hellos hamada _88	59.00	80.00	139.00	pending	cash	pending	\N	2026-03-11 17:04:47	2026-03-11 17:04:47	home	\N	\N
37	ORD-1212C7	\N	zmartzin	hmada@email.com	555555555	Mila 4433 4 242	614.00	80.00	694.00	pending	cash	pending	bhhhhh	2026-03-11 17:17:05	2026-03-11 17:17:05	home	\N	\N
\.


--
-- Data for Name: personal_access_tokens; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.personal_access_tokens (id, tokenable_type, tokenable_id, name, token, abilities, last_used_at, expires_at, created_at, updated_at) FROM stdin;
13	App\\Models\\User	5	auth-token	d83187f887cd91b76142412d312b8cbb7357266769fc1ab089376fe688948cdc	["*"]	2026-03-11 00:04:56	\N	2026-03-10 22:21:35	2026-03-11 00:04:56
7	App\\Models\\User	4	auth-token	fb54d0b8653b74d8fc2e933db3bcda4ce8f20a1d36deb5eb6a803b692f5f5bbf	["*"]	2026-03-07 15:27:55	\N	2026-03-07 15:18:47	2026-03-07 15:27:55
14	App\\Models\\User	5	auth-token	47114df007bb320b7d05e749bb5a8eb50c8774457a9c501bcb2e8c5dd5998def	["*"]	2026-03-11 00:39:32	\N	2026-03-11 00:16:09	2026-03-11 00:39:32
10	App\\Models\\User	4	auth-token	4d2bc90ef9082e9e8b65dc377e10986f112d8201c93ce40fae98f9eb49cd52bc	["*"]	2026-03-07 15:37:45	\N	2026-03-07 15:37:31	2026-03-07 15:37:45
1	App\\Models\\User	5	auth-token	12e7ff308944cecebcd7d362ab6712a696fde5ef4a70f8f113f231e4668adbc0	["*"]	2026-03-05 15:21:09	\N	2026-03-05 15:18:40	2026-03-05 15:21:09
11	App\\Models\\User	4	auth-token	2a2c32ea21f10b67c2b1568e904ae54c0925962f7c450d30906d964e7b370fb8	["*"]	2026-03-07 15:47:28	\N	2026-03-07 15:47:25	2026-03-07 15:47:28
15	App\\Models\\User	5	auth-token	12a4cc70431be06bad48e10c3d8bb34c83887655351bdb2be3f803018ccd2446	["*"]	2026-03-11 00:51:20	\N	2026-03-11 00:50:14	2026-03-11 00:51:20
8	App\\Models\\User	4	auth-token	70eb25457c6c4b97f10ce24df8dfdd4d9b81173c1cfc653aef053ee524ee89f4	["*"]	2026-03-07 15:35:42	\N	2026-03-07 15:31:32	2026-03-07 15:35:42
4	App\\Models\\User	5	auth-token	f07b84f20e3598139bf331b4de6d12339e27513e8f2c91ce38f8762cd30d1d85	["*"]	2026-03-06 16:36:01	\N	2026-03-05 16:14:05	2026-03-06 16:36:01
16	App\\Models\\User	4	auth-token	eebfb850949481b8b0bef635e06818bb5b2ec3d30bcb37b328636e547ef686f4	["*"]	2026-03-11 00:51:53	\N	2026-03-11 00:51:50	2026-03-11 00:51:53
2	App\\Models\\User	6	auth-token	2e18773c9e956ad09f73d6c780b829868a4cfd8f1eef9595ac50bc188cf21395	["*"]	2026-03-05 15:58:19	\N	2026-03-05 15:25:03	2026-03-05 15:58:19
6	App\\Models\\User	6	auth-token	cc1027b08e4bde742e4e6b0ae23b297d89e7d684fc49c40cf7a935cae92394c8	["*"]	2026-03-07 15:18:24	\N	2026-03-06 16:58:55	2026-03-07 15:18:24
12	App\\Models\\User	4	auth-token	6998d8a77588e44511501f830e74bc847e0a7f0d43dea4e32a32f64f250e5dff	["*"]	2026-03-10 22:21:07	\N	2026-03-10 16:56:39	2026-03-10 22:21:07
17	App\\Models\\User	5	auth-token	0f87f35f5c3bda2c27c18bde846eb9075164fc0c0e7deeaea5e8ec7456952293	["*"]	2026-03-11 00:59:57	\N	2026-03-11 00:59:54	2026-03-11 00:59:57
9	App\\Models\\User	4	auth-token	8f20b366e0a39289fee3a4052783ae13beddefc5416d124ecdf4003078997a0d	["*"]	2026-03-07 15:37:17	\N	2026-03-07 15:35:55	2026-03-07 15:37:17
3	App\\Models\\User	6	auth-token	b3e5b75fad6c6eafa73d1e1fa93ed421ae8908dac4bda3a6883cedf57e3bfaee	["*"]	2026-03-05 16:11:18	\N	2026-03-05 16:11:06	2026-03-05 16:11:18
5	App\\Models\\User	5	auth-token	21d464db39c110a81b666ab56cc6e51d7b8941a463b3a9ab6eb306b2dadf5a15	["*"]	2026-03-06 16:57:48	\N	2026-03-06 16:37:05	2026-03-06 16:57:48
18	App\\Models\\User	5	auth-token	50208d875810f063775789c38374f90f539081da324d005d027a66fd3681042b	["*"]	2026-03-11 01:27:49	\N	2026-03-11 01:04:59	2026-03-11 01:27:49
\.


--
-- Data for Name: products; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.products (id, category_id, name, slug, description, price, stock, sku, status, created_at, updated_at, deleted_at, image) FROM stdin;
24	13	Sellion Artwork	sellion-artwork	Sellion Artwork Oud For Greatness Eau de Parfum Intense	59.00	8	PRO994	t	2026-03-11 01:02:50	2026-03-11 17:04:47	\N	products/63ylhcgs4rHLIDB0OKA9QZzPKWF10h3jkDd2xNKO.png
15	3	CASSQUE	zmartzin	JJJJ	50.00	287	PROD001	t	2025-11-11 15:01:31	2026-03-11 17:17:05	\N	products/n1UzQ2peAxfKGCnIjaFWKrz1SwmIrVD4OknakpdT.jpg
21	12	ZMARTZINXD	zmartzinxd	HHHHH	10.00	0	PRxdd	t	2025-11-12 10:32:53	2026-03-11 17:17:05	\N	products/nxAW8U1j88XCRTDM0BGvtibIwzbTZ1LZv9w7qw55.jpg
22	11	Wirless Headphones	wirless	Experience your music without limits. These premium wireless headphones deliver crystal-clear audio, deep bass, and active noise cancellation to keep you fully immersed wherever you go.\r\n\r\nDesigned for comfort and durability, the lightweight, cushioned ear cups and adjustable headband provide an all-day listening experience. With up to 30 hours of battery life, fast charging, and seamless Bluetooth 5.3 connectivity, you can enjoy your favorite tunes, calls, and podcasts without interruptions.	554.00	497	PRODzz	t	2025-11-13 14:30:12	2026-03-11 17:17:05	\N	products/5npcblnwU6ZZF1cXBQYcdGA8jOv3AZOcBVOKjO3d.jpg
19	11	Wireless Headphones	wireless-headphones	hhhhh	895.00	0	PROD	t	2025-11-12 10:31:59	2026-03-10 23:40:01	\N	products/6dH6bf9PF26N8Jbo0VEZwhBXMoI4a7qx63PO8HFi.jpg
18	3	ELECTRO	electro	minagi	50.00	387	DKOADA	t	2025-11-12 10:31:29	2026-03-11 01:15:24	\N	products/WkVuZiePdfQYQmMlDUuOJ0Xq7qyW55IMjc6aw4RU.jpg
\.


--
-- Data for Name: sessions; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.sessions (id, user_id, ip_address, user_agent, payload, last_activity) FROM stdin;
vu5eSR87ATCgWkJGJ9EreHe00JCtAXLhmWQF7roq	\N	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Safari/537.36 OPR/127.0.0.0	YTozOntzOjY6Il90b2tlbiI7czo0MDoiYTl3Njd2MVNtZlRJbDdqSDVQekRnWWJMZWt0emZIdmVuRll1ZzkyMCI7czo5OiJfcHJldmlvdXMiO2E6MTp7czozOiJ1cmwiO3M6MjE6Imh0dHA6Ly9sb2NhbGhvc3Q6ODAwMCI7fXM6NjoiX2ZsYXNoIjthOjI6e3M6Mzoib2xkIjthOjA6e31zOjM6Im5ldyI7YTowOnt9fX0=	1773245212
THpwzBspprwR3ybfYmdGzvV0Pz2uvzYoc7U4xj6n	\N	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Safari/537.36 OPR/127.0.0.0	YTo0OntzOjY6Il90b2tlbiI7czo0MDoiVHpnbURYTVZPMW13aTZpV0IwYVV0ZXFJN1NPeU5SY29OVWZBM0t2diI7czo5OiJfcHJldmlvdXMiO2E6MTp7czozOiJ1cmwiO3M6MzA6Imh0dHA6Ly8xMjcuMC4wLjE6ODAwMC9jaGVja291dCI7fXM6NjoiX2ZsYXNoIjthOjI6e3M6Mzoib2xkIjthOjA6e31zOjM6Im5ldyI7YTowOnt9fXM6MzoidXJsIjthOjE6e3M6ODoiaW50ZW5kZWQiO3M6Mzg6Imh0dHA6Ly8xMjcuMC4wLjE6ODAwMC9jbGllbnQvbXktb3JkZXJzIjt9fQ==	1773249484
\.


--
-- Data for Name: users; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.users (id, name, email, email_verified_at, password, avatar, remember_token, is_admin, created_at, updated_at, role, phone, picture, address, google_id) FROM stdin;
4	Amokrane Ahmed	amokrane.ahmed10@gmail.com	\N	\N	https://lh3.googleusercontent.com/a/ACg8ocJ618LK8WuH08b4lcXm2Kl_L4lXS4KUziihyaQ1KpkS9CLe1bo=s96-c	\N	f	2026-03-04 17:33:47	2026-03-04 17:33:47	user	\N	\N	\N	116887326405546563581
5	zmartzin	smart.gaming86@gmail.com	\N	\N	https://lh3.googleusercontent.com/a/ACg8ocJu0o8Qi_u9M82C1b-88MtXJDwUuTsN5I9pQkWZRt1R4ye53_pp=s96-c	\N	f	2026-03-04 17:34:04	2026-03-04 17:34:04	user	\N	\N	\N	110757176441178843092
6	Ahmed AMOKRANE	ahmed.amokrane@univ-constantine2.dz	\N	\N	https://lh3.googleusercontent.com/a/ACg8ocLQo6JcvX8Ct0JrfnXx4lFpezfg8wm8W9MDJNvkvRlypTm08aA1=s96-c	\N	f	2026-03-05 15:25:00	2026-03-05 15:25:00	user	\N	\N	\N	114679976555374339925
2	ZMART	client@gmail.com	\N	$2y$12$uoq38QlC0T.ZM/zMMSzvqeLwkUy8ue77VCbX4uMF0/YDgpxZEGgwS	\N	4jrFkhosRKCJ8Iqqdzh5U6sy08jyywjCLcxm3oMdi6mEcVtCmUBJjBW5aJN4	f	2025-10-29 14:03:58	2025-12-24 10:55:03	user	+213 542710629	avatars/hZ662wfVxlKGQDe6qJBHSiiwjMUPGJoqa9LC1gPX.jpg	Mila-Oued Athmania - Aissat idir	\N
3	Ahmed Amokrane	ahmed.amokrane@gmail.com	\N	$2y$12$lGSKVl3CDqpoO.sGNRRGeOPQ0oLovp2MOUNcM7lgJter4u0w3/1aq	\N	XfRwSI6SPAlv8xcn3tCuXVcTnTIxBtVVKYfqwj2NYVn6C61JGG1ezS1IqkHr	f	2025-12-01 12:12:46	2025-12-01 12:12:46	client	542710629	\N	Mila-Oued Athmania - Aissat idir	\N
1	Admin	admin@gmail.com	\N	$2y$12$2/trg/yBO/SNtWHxg84ode/vYK/bhfwXKXfM.Z1rCm7V2pXaKokqS	\N	gUQHHeMLjrkEN3JiBOI96sA9vEfOekvxVchwIkgbYAPuZIfodUMpr7K6EaLh	f	2025-10-29 14:03:57	2025-10-29 14:03:57	admin	\N	\N	\N	\N
\.


--
-- Name: categories_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.categories_id_seq', 13, true);


--
-- Name: failed_jobs_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.failed_jobs_id_seq', 6, true);


--
-- Name: jobs_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.jobs_id_seq', 17, true);


--
-- Name: migrations_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.migrations_id_seq', 16, true);


--
-- Name: order_items_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.order_items_id_seq', 57, true);


--
-- Name: orders_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.orders_id_seq', 37, true);


--
-- Name: personal_access_tokens_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.personal_access_tokens_id_seq', 18, true);


--
-- Name: products_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.products_id_seq', 24, true);


--
-- Name: users_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.users_id_seq', 6, true);


--
-- Name: cache_locks cache_locks_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.cache_locks
    ADD CONSTRAINT cache_locks_pkey PRIMARY KEY (key);


--
-- Name: cache cache_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.cache
    ADD CONSTRAINT cache_pkey PRIMARY KEY (key);


--
-- Name: categories categories_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.categories
    ADD CONSTRAINT categories_pkey PRIMARY KEY (id);


--
-- Name: categories categories_slug_unique; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.categories
    ADD CONSTRAINT categories_slug_unique UNIQUE (slug);


--
-- Name: failed_jobs failed_jobs_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.failed_jobs
    ADD CONSTRAINT failed_jobs_pkey PRIMARY KEY (id);


--
-- Name: failed_jobs failed_jobs_uuid_unique; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.failed_jobs
    ADD CONSTRAINT failed_jobs_uuid_unique UNIQUE (uuid);


--
-- Name: job_batches job_batches_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.job_batches
    ADD CONSTRAINT job_batches_pkey PRIMARY KEY (id);


--
-- Name: jobs jobs_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.jobs
    ADD CONSTRAINT jobs_pkey PRIMARY KEY (id);


--
-- Name: migrations migrations_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.migrations
    ADD CONSTRAINT migrations_pkey PRIMARY KEY (id);


--
-- Name: order_items order_items_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.order_items
    ADD CONSTRAINT order_items_pkey PRIMARY KEY (id);


--
-- Name: orders orders_order_number_unique; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.orders
    ADD CONSTRAINT orders_order_number_unique UNIQUE (order_number);


--
-- Name: orders orders_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.orders
    ADD CONSTRAINT orders_pkey PRIMARY KEY (id);


--
-- Name: personal_access_tokens personal_access_tokens_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.personal_access_tokens
    ADD CONSTRAINT personal_access_tokens_pkey PRIMARY KEY (id);


--
-- Name: personal_access_tokens personal_access_tokens_token_unique; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.personal_access_tokens
    ADD CONSTRAINT personal_access_tokens_token_unique UNIQUE (token);


--
-- Name: products products_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.products
    ADD CONSTRAINT products_pkey PRIMARY KEY (id);


--
-- Name: products products_sku_unique; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.products
    ADD CONSTRAINT products_sku_unique UNIQUE (sku);


--
-- Name: products products_slug_unique; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.products
    ADD CONSTRAINT products_slug_unique UNIQUE (slug);


--
-- Name: sessions sessions_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.sessions
    ADD CONSTRAINT sessions_pkey PRIMARY KEY (id);


--
-- Name: users users_email_unique; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_unique UNIQUE (email);


--
-- Name: users users_google_id_unique; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_google_id_unique UNIQUE (google_id);


--
-- Name: users users_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_pkey PRIMARY KEY (id);


--
-- Name: jobs_queue_index; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX jobs_queue_index ON public.jobs USING btree (queue);


--
-- Name: personal_access_tokens_expires_at_index; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX personal_access_tokens_expires_at_index ON public.personal_access_tokens USING btree (expires_at);


--
-- Name: personal_access_tokens_tokenable_type_tokenable_id_index; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX personal_access_tokens_tokenable_type_tokenable_id_index ON public.personal_access_tokens USING btree (tokenable_type, tokenable_id);


--
-- Name: sessions_last_activity_index; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX sessions_last_activity_index ON public.sessions USING btree (last_activity);


--
-- Name: sessions_user_id_index; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX sessions_user_id_index ON public.sessions USING btree (user_id);


--
-- Name: order_items order_items_order_id_foreign; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.order_items
    ADD CONSTRAINT order_items_order_id_foreign FOREIGN KEY (order_id) REFERENCES public.orders(id) ON DELETE CASCADE;


--
-- Name: order_items order_items_product_id_foreign; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.order_items
    ADD CONSTRAINT order_items_product_id_foreign FOREIGN KEY (product_id) REFERENCES public.products(id) ON DELETE CASCADE;


--
-- Name: orders orders_user_id_foreign; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.orders
    ADD CONSTRAINT orders_user_id_foreign FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE;


--
-- Name: products products_category_id_foreign; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.products
    ADD CONSTRAINT products_category_id_foreign FOREIGN KEY (category_id) REFERENCES public.categories(id) ON DELETE CASCADE;


--
-- PostgreSQL database dump complete
--

\unrestrict is17f7QuhGdthu955AxeIzRVdZBYGthbTs0cxbkhcuUoOS6S3b24dpoFjE49wlF

