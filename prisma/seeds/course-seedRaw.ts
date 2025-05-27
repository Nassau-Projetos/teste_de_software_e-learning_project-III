import { PrismaClient } from '@prisma/client'
import courseData from '../seeds/data/course.json'

export async function seedCourse(prisma: PrismaClient) {
	function formatDate(dateString?: string | null) {
		if (!dateString) return 'NULL'
		return `'${new Date(dateString).toISOString().split('T')[0]}'`
	}

	function escape(str?: string | null) {
		if (!str) return 'NULL'
		return `'${str.replace(/'/g, "\\'")}'`
	}

	const values = courseData
		.map((course) => {
			const {
				id,
				title,
				description,
				slug,
				thumbnailUrl,
				duration,
				studentsCount,
				priceAmount,
				priceCurrency,
				discountPercentage,
				discountExpiresAt,
				level,
				rating,
				ratingCount,
				instructorId,
				courseCategoryId,
				statusId,
			} = course

			return `(
  '${id}',
  ${escape(title)},
  ${escape(description)},
  ${escape(slug)},
  ${escape(thumbnailUrl)},
  ${duration},
  ${studentsCount},
  ${priceAmount},
  ${escape(priceCurrency)},
  ${discountPercentage ?? 'NULL'},
  ${formatDate(discountExpiresAt)},
  '${level}',
  ${rating},
  ${ratingCount},
  NULL,  -- publishedAt aqui (ou uma data válida)
  '${instructorId}',
  ${courseCategoryId},
  ${statusId}
)`
		})
		.join(',\n')

	const query = `
    INSERT INTO courses (
      id, title, description, slug, thumbnailUrl,
      duration, studentsCount, priceAmount, priceCurrency,
      discountPercentage, discountExpiresAt, level,
      rating, ratingCount, publishedAt,
      instructorId, courseCategoryId, statusId
    )
    VALUES ${values}
    ON DUPLICATE KEY UPDATE
      title = VALUES(title),
      description = VALUES(description),
      slug = VALUES(slug),
      thumbnailUrl = VALUES(thumbnailUrl),
      duration = VALUES(duration),
      studentsCount = VALUES(studentsCount),
      priceAmount = VALUES(priceAmount),
      priceCurrency = VALUES(priceCurrency),
      discountPercentage = VALUES(discountPercentage),
      discountExpiresAt = VALUES(discountExpiresAt),
      level = VALUES(level),
      rating = VALUES(rating),
      ratingCount = VALUES(ratingCount),
      publishedAt = VALUES(publishedAt),
      instructorId = VALUES(instructorId),
      courseCategoryId = VALUES(courseCategoryId),
      statusId = VALUES(statusId)
  `

	await prisma.$executeRawUnsafe(query)
}
