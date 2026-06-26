import { Router } from 'express';
import { z } from 'zod';
import { AppError } from '../../http/errors';
import { BookingService } from '../types';
import { availabilityQuerySchema, bookingRequestSchema, emailSchema, localeSchema, pricingRequestSchema, referenceSchema, resourceSlugSchema } from '../validation/bookingSchemas';
function parse<T>(schema:z.ZodType<T>,input:unknown):T{const result=schema.safeParse(input);if(!result.success)throw new AppError(400,'VALIDATION_ERROR','Request validation failed',result.error.flatten());return result.data}
export function createPublicBookingRouter(service:BookingService){const router=Router();
 router.get('/categories',async(request,response)=>{const locale=parse(localeSchema,request.query.locale)||'sv';response.json({data:{categories:await service.listPublicCategories(locale)}})});
 router.get('/resources',async(request,response)=>{const locale=parse(localeSchema,request.query.locale)||'sv';response.json({data:{resources:await service.listPublicResources(locale)}})});
 router.get('/resources/:slug',async(request,response)=>{const locale=parse(localeSchema,request.query.locale)||'sv';response.json({data:{resource:await service.getPublicResource(parse(resourceSlugSchema,request.params.slug),locale)}})});
 router.get('/availability',async(request,response)=>{const query=parse(availabilityQuerySchema,request.query);response.json({data:{intervals:await service.getAvailability(query.resourceId,new Date(query.from),new Date(query.to))}})});
 router.post('/price',async(request,response)=>{const input=parse(pricingRequestSchema,request.body);response.json({data:{price:await service.calculatePrice({...input,kitchenExtra:input.kitchenExtra??false,saunaExtra:input.saunaExtra??false,startAt:new Date(input.startAt),endAt:new Date(input.endAt)})}})});
 router.post('/',async(request,response)=>{const input=parse(bookingRequestSchema,request.body);const result=await service.createBooking({...input,kitchenExtra:input.kitchenExtra??false,saunaExtra:input.saunaExtra??false,startAt:new Date(input.startAt),endAt:new Date(input.endAt)},{ip:request.ip,userAgent:request.header('user-agent')});response.status(201).json({data:result})});
 router.post('/status',async(request,response)=>{const input=parse(z.object({reference:referenceSchema,email:emailSchema,locale:localeSchema}),request.body);response.json({data:{booking:await service.getPublicBooking(input.reference,input.email,input.locale||'sv')}})});
 return router}
