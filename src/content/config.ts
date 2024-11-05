import { glob } from 'astro/loaders'
import { defineCollection, z } from 'astro:content'

const blog = defineCollection({
	loader: glob({ pattern: '**/*.{md,mdx}', base: 'src/content/blog' }),
	// Type-check frontmatter using a schema
	schema: z.object({
		title: z.string(),
		description: z.string(),
		// Transform string to Date object
		pubDate: z.coerce.date(),
		updatedDate: z.coerce.date().optional(),
		heroImage: z.string().optional()
	})
})

const countries = defineCollection({
	loader: async () => {
		const response = await fetch('https://restcountries.com/v3.1/all')
		const data = await response.json()

		// Must return an array of entries with an id property, or an object with IDs as keys and entries as values
		return data.map((country: any) => ({
			id: country.cca3,
			name: country.name.common,
			...country
		}))
	},
	schema: z.object({
		id: z.string(),
		// name: z.string()
		name: z.object({
			common: z.string(),
			official: z.string(),
			nativeName: z
				.object({
					eng: z
						.object({ official: z.string(), common: z.string() })
						.optional()
				})
				.optional()
		}),
		tld: z.array(z.string()).optional(),
		cca2: z.string(),
		ccn3: z.string().optional(),
		cca3: z.string(),
		independent: z.boolean().optional(),
		status: z.string(),
		unMember: z.boolean(),
		currencies: z
			.object({
				SHP: z
					.object({ name: z.string(), symbol: z.string() })
					.optional()
			})
			.optional(),
		idd: z
			.object({
				root: z.string().optional(),
				suffixes: z.array(z.string()).optional()
			})
			.optional(),
		capital: z.array(z.string()).optional(),
		altSpellings: z.array(z.string()),
		region: z.string(),
		languages: z.object({ eng: z.string().optional() }).optional(),
		translations: z.object({
			ara: z.object({ official: z.string(), common: z.string() }),
			bre: z.object({ official: z.string(), common: z.string() }),
			ces: z.object({ official: z.string(), common: z.string() }),
			cym: z.object({ official: z.string(), common: z.string() }),
			deu: z.object({ official: z.string(), common: z.string() }),
			est: z.object({ official: z.string(), common: z.string() }),
			fin: z.object({ official: z.string(), common: z.string() }),
			fra: z.object({ official: z.string(), common: z.string() }),
			hrv: z
				.object({ official: z.string(), common: z.string() })
				.optional(),
			hun: z.object({ official: z.string(), common: z.string() }),
			ita: z.object({ official: z.string(), common: z.string() }),
			jpn: z
				.object({ official: z.string(), common: z.string() })
				.optional(),
			kor: z.object({ official: z.string(), common: z.string() }),
			nld: z.object({ official: z.string(), common: z.string() }),
			per: z
				.object({ official: z.string(), common: z.string() })
				.optional(),
			pol: z.object({ official: z.string(), common: z.string() }),
			por: z.object({ official: z.string(), common: z.string() }),
			rus: z.object({ official: z.string(), common: z.string() }),
			slk: z.object({ official: z.string(), common: z.string() }),
			spa: z.object({ official: z.string(), common: z.string() }),
			srp: z.object({ official: z.string(), common: z.string() }),
			swe: z.object({ official: z.string(), common: z.string() }),
			tur: z.object({ official: z.string(), common: z.string() }),
			urd: z.object({ official: z.string(), common: z.string() }),
			zho: z
				.object({ official: z.string(), common: z.string() })
				.optional()
		}),
		latlng: z.array(z.number()),
		landlocked: z.boolean(),
		area: z.number(),
		demonyms: z
			.object({ eng: z.object({ f: z.string(), m: z.string() }) })
			.optional(),
		flag: z.string(),
		maps: z.object({ googleMaps: z.string(), openStreetMaps: z.string() }),
		population: z.number(),
		car: z.object({
			signs: z.array(z.string()).optional(),
			side: z.string()
		}),
		timezones: z.array(z.string()),
		continents: z.array(z.string()),
		flags: z.object({ png: z.string(), svg: z.string() }),
		coatOfArms: z.object({}),
		startOfWeek: z.string(),
		capitalInfo: z
			.object({ latlng: z.array(z.number()).optional() })
			.optional()
	})
})

// export const collections = { countries, blog }
export const collections = { blog, countries }
