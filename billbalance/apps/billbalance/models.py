from django.db import models
import datetime

class Person(models.Model):
    name = models.CharField(max_length=127)

    def __unicode__(self):
        return self.name

    def balance(self):
        amount = Bill.objects.filter(person=self).aggregate(models.Sum('amount'))['amount__sum']
        if amount is None:
            return 0
        return amount

    def pays(self, amount, persons, description='', category=None):
        receipt = Receipt.objects.create(
            description = description,
            category = category,
            amount = amount
        )
        receipt.payment_bill = Bill.objects.create(person=self, amount=amount)
        amount /= (float) (-len(persons))
        for person in persons:
            person = Person.objects.get(name=person)
            receipt.related_bills.add(Bill.objects.create(person=person, amount=amount))
        receipt.save()
    
    def amount_spent(self, delta_begin=0, delta_end=30):
        bills = Bill.objects.filter(amount__lt=0).filter(person=self)
        bills = bills.filter(date__lte=datetime.datetime.utcnow() - datetime.timedelta(days=delta_begin))
        bills = bills.filter(date__gt=datetime.datetime.utcnow() - datetime.timedelta(days=delta_end))
        
        bills = map(lambda x: x, bills)
        date_begin = bills[0].date
        date_end = bills[-1].date
        
        bills = map(lambda x: -int(x.amount), bills)
        return sum(bills)/(date_end - date_begin).days
    
    def avg_this_month(self):
        d = datetime.datetime.utcnow()
        # Take the first of this month
        d = datetime.datetime(year=d.year, month=d.month, day=1)
        
        bills = Bill.objects.filter(amount__lt=0)
        bills = bills.filter(person=self)
        # From the first of this month untill now
        bills = bills.filter(date__gte=d)
        
        bills = map(lambda x: x, bills)
        
        bills = map(lambda x: -int(x.amount), bills)
        return sum(bills)/((datetime.datetime.utcnow() - d).days + 1)
    
    def guess_amount_spent(self):
        return self.avg_this_month() * 30
            
    def amount_spent_this_month(self):
        bills = Bill.objects.filter(amount__lt=0).filter(person=self)
        date_begin = datetime.datetime.utcnow().replace(day=1)
        bills = bills.filter(date__gte=date_begin)
    
        bills = map(lambda x: -int(x.amount), bills)
        return sum(bills)
            
    def amount_spent_last_month(self):
        bills = Bill.objects.filter(amount__lt=0).filter(person=self)
        
        date_end = datetime.datetime.utcnow()
        # First of this month
        date_end = datetime.datetime(year=date_end.year, month=date_end.month, day=1)
        # Last of last month
        date_begin = date_end - datetime.timedelta(days=1)
        # First of last month
        date_begin = date_begin.replace(day=1)
        
        bills = bills.filter(date__gte=date_begin)
        bills = bills.filter(date__lt=date_end)
        bills = map(lambda x: -int(x.amount), bills)
        return sum(bills)
            
class Bill(models.Model):
    person = models.ForeignKey(Person)
    amount = models.FloatField()
    date = models.DateTimeField(auto_now_add=True)

    def __unicode__(self):
        return self.person.name + ' ' + str(self.amount) + ' ' + str(self.date)

class Category(models.Model):
    name = models.CharField(max_length=255)
    
    def amount(self, person=None, start_date=None, end_date=None):
        receipts = self.receipt_set.all()#.filter(date__gt=datetime.datetime.utcnow() - datetime.timedelta(days=60))
        if start_date:
            receipts = receipts.filter(date__gte=start_date)
        if end_date:
            receipts = receipts.filter(date__lte=end_date)
        if person:
            def _filter(receipt):
                for related_bill in receipt.related_bills.all():
                    if related_bill.person.id == person.id:
                        return True
                return False
            receipts = filter(_filter, receipts)
        return sum(map(lambda x: x.amount, receipts))
    
    def __unicode__(self):
        return self.name
    
class Receipt(models.Model):
    description = models.CharField(max_length=255)
    category = models.ForeignKey(Category)
    payment_bill = models.ForeignKey(Bill, related_name='receipt', default=None, null=True)
    related_bills = models.ManyToManyField(Bill, related_name='receipt_set', default=None, null=True)
    amount = models.FloatField()
    date = models.DateTimeField(auto_now_add=True)
    
    
    def __unicode__(self):
        return self.description