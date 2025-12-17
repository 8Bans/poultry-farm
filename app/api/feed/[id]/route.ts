import { NextRequest, NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
import connectDB from '@/lib/db/mongodb';
import Feed from '@/lib/models/Feed';
import Transaction from '@/lib/models/Transaction';
import { requireAuth } from '@/lib/auth/get-session';
import { createFeedLogSchema } from '@/lib/validations/schemas';
import { Types } from 'mongoose';

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { session, error } = await requireAuth();
    if (error) return error;

    const { id } = await params;

    if (!Types.ObjectId.isValid(id)) {
      return NextResponse.json(
        { success: false, error: 'Invalid feed record ID' },
        { status: 400 }
      );
    }

    const body = await request.json();
    const validatedFields = createFeedLogSchema.safeParse(body);

    if (!validatedFields.success) {
      return NextResponse.json(
        {
          success: false,
          error: 'Validation failed',
          details: validatedFields.error.flatten().fieldErrors,
        },
        { status: 400 }
      );
    }

    const { type, price, bags, kgPerBag, date } = validatedFields.data;

    await connectDB();

    // Find the existing feed record
    const existingFeed = await Feed.findOne({
      _id: id,
      userId: session!.user.id,
    });

    if (!existingFeed) {
      return NextResponse.json(
        { success: false, error: 'Feed record not found' },
        { status: 404 }
      );
    }

    // Update the feed record
    const updatedFeed = await Feed.findByIdAndUpdate(
      id,
      {
        type,
        price,
        bags,
        kgPerBag,
        totalKg: bags * kgPerBag,
        date: date ? new Date(date) : existingFeed.date,
      },
      { new: true, runValidators: true }
    );

    // Update associated transaction if it exists
    if (existingFeed.price > 0) {
      const existingTransaction = await Transaction.findOne({
        feedId: id,
        userId: session!.user.id,
      });

      if (existingTransaction && price > 0) {
        // Update existing transaction
        await Transaction.findByIdAndUpdate(existingTransaction._id, {
          amount: price,
          description: `Feed purchase: ${bags} bags of ${type} (${bags * kgPerBag}kg total)`,
          date: updatedFeed!.date,
        });
      } else if (existingTransaction && price === 0) {
        // Delete transaction if price is now 0
        await Transaction.findByIdAndDelete(existingTransaction._id);
      } else if (!existingTransaction && price > 0) {
        // Create new transaction if one didn't exist before
        await Transaction.create({
          userId: session!.user.id,
          type: 'expense',
          category: 'Feed',
          amount: price,
          description: `Feed purchase: ${bags} bags of ${type} (${bags * kgPerBag}kg total)`,
          feedId: updatedFeed!._id,
          date: updatedFeed!.date,
        });
      }
    } else if (price > 0) {
      // Create new transaction if none existed before
      await Transaction.create({
        userId: session!.user.id,
        type: 'expense',
        category: 'Feed',
        amount: price,
        description: `Feed purchase: ${bags} bags of ${type} (${bags * kgPerBag}kg total)`,
        feedId: updatedFeed!._id,
        date: updatedFeed!.date,
      });
    }

    // Revalidate pages
    revalidatePath('/dashboard');
    revalidatePath('/finances');

    return NextResponse.json({
      success: true,
      data: updatedFeed,
      message: 'Feed record updated successfully',
    });
  } catch (error) {
    console.error('Feed PATCH error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { session, error } = await requireAuth();
    if (error) return error;

    const { id } = await params;

    if (!Types.ObjectId.isValid(id)) {
      return NextResponse.json(
        { success: false, error: 'Invalid feed record ID' },
        { status: 400 }
      );
    }

    await connectDB();

    const feed = await Feed.findOneAndDelete({
      _id: id,
      userId: session!.user.id,
    });

    if (!feed) {
      return NextResponse.json(
        { success: false, error: 'Feed record not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Feed record deleted successfully',
    });
  } catch (error) {
    console.error('Feed DELETE error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}
